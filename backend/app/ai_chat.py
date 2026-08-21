import os
import json
import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

# Import LiteLLM as specified in Cerebras skill
try:
    import litellm
    # Set drop_params to avoid litellm parameter warnings
    litellm.drop_params = True
    LITELLM_AVAILABLE = True
except ImportError:
    LITELLM_AVAILABLE = False

US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
]


class AIChatResponseSchema(BaseModel):
    reply: str = Field(..., description="Friendly summary of the updates made and follow up questions.")
    updated_fields: Dict[str, Any] = Field(default_factory=dict, description="Extracted legal document fields to update.")


def _get_openrouter_api_key() -> Optional[str]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if api_key and not api_key.startswith("sk-or-dummy"):
        return api_key.strip()

    # Try reading from root .env
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("OPENROUTER_API_KEY="):
                    val = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if val and not val.startswith("sk-or-dummy"):
                        return val
    return None


def _clean_json_content(content: str) -> str:
    """Removes markdown code block formatting (e.g. ```json ... ```) from LLM output."""
    if not content:
        return ""
    content = content.strip()
    if content.startswith("```"):
        content = re.sub(r"^```(?:json)?\s*", "", content, flags=re.IGNORECASE)
        content = re.sub(r"\s*```$", "", content)
    return content.strip()


def _merge_party_data(current: dict, new_data: dict) -> dict:
    """Safely merges party sub-dictionaries."""
    merged = dict(current or {})
    if isinstance(new_data, dict):
        for k, v in new_data.items():
            if v is not None and v != "":
                merged[k] = v
    return merged


def process_ai_chat(messages: list = None, current_data: dict = None) -> dict:
    """
    Processes freeform AI chat for Common Paper legal document drafting.
    1. Uses LiteLLM via OpenRouter to `openrouter/openai/gpt-oss-20b` with Cerebras inference provider.
    2. Uses Structured Outputs via Pydantic for JSON schema extraction.
    3. Merges updated fields with existing current_data to preserve party details.
    4. Includes robust local NLP fallback rule engine.
    """
    if messages is None:
        messages = []
    if current_data is None:
        current_data = {}

    api_key = _get_openrouter_api_key()
    if api_key:
        os.environ["OPENROUTER_API_KEY"] = api_key

    last_user_msg = ""
    for msg in reversed(messages):
        if isinstance(msg, dict) and msg.get("role") == "user":
            last_user_msg = msg.get("content", "")
            break

    # 1. Attempt LiteLLM call to OpenRouter with Cerebras provider order per GEMINI.md & Cerebras Skill
    if LITELLM_AVAILABLE and api_key:
        models_to_try = [
            "openrouter/openai/gpt-oss-20b",
            "openrouter/meta-llama/llama-3.3-70b-instruct"
        ]

        system_prompt = (
            "You are PreLegal AI, an intelligent legal assistant helping users fill out and customize Common Paper legal documents.\n"
            "Interpret the user's instructions and return ONLY a valid JSON object matching this schema:\n"
            "{\n"
            '  "reply": "Friendly response summarizing the updates and asking about remaining fields.",\n'
            '  "updated_fields": {\n'
            '    "party1": {"name": "...", "type": "...", "state": "...", "address": "...", "email": "...", "signerName": "...", "signerTitle": "..."}, (optional)\n'
            '    "party2": {"name": "...", "type": "...", "state": "...", "address": "...", "email": "...", "signerName": "...", "signerTitle": "..."}, (optional)\n'
            '    "purpose": "...", (optional)\n'
            '    "agreementTermYears": 1, (optional)\n'
            '    "confidentialityTerm": "perpetuity" | "fixed", (optional)\n'
            '    "confidentialityTermYears": 5, (optional)\n'
            '    "governingLawState": "Delaware", (optional)\n'
            '    "jurisdiction": "State and Federal Courts in Delaware" (optional)\n'
            "  }\n"
            "}"
        )

        formatted_messages = [{"role": "system", "content": system_prompt}]
        for m in messages:
            if isinstance(m, dict):
                role = m.get("role", "user")
                content = m.get("content", "")
                if content:
                    formatted_messages.append({"role": role, "content": content})

        for model in models_to_try:
            try:
                # Try litellm completion with Structured Output / response_format
                response = litellm.completion(
                    model=model,
                    messages=formatted_messages,
                    response_format=AIChatResponseSchema,
                    reasoning_effort="low",
                    extra_body={"provider": {"order": ["cerebras"]}},
                    api_key=api_key,
                    timeout=6
                )

                raw_content = response.choices[0].message.content
                if raw_content:
                    if isinstance(raw_content, str):
                        clean_str = _clean_json_content(raw_content)
                        parsed = json.loads(clean_str)
                    elif isinstance(raw_content, dict):
                        parsed = raw_content
                    else:
                        continue

                    if isinstance(parsed, dict) and "reply" in parsed and "updated_fields" in parsed:
                        uf = parsed.get("updated_fields", {})
                        if isinstance(uf, dict):
                            if "party1" in uf and isinstance(uf["party1"], dict):
                                uf["party1"] = _merge_party_data(current_data.get("party1", {}), uf["party1"])
                            if "party2" in uf and isinstance(uf["party2"], dict):
                                uf["party2"] = _merge_party_data(current_data.get("party2", {}), uf["party2"])

                            return {
                                "reply": str(parsed.get("reply", "Updates applied successfully.")),
                                "updated_fields": uf,
                                "status": "success"
                            }
            except Exception:
                # Try fallback json_object format if schema format failed
                try:
                    response = litellm.completion(
                        model=model,
                        messages=formatted_messages,
                        response_format={"type": "json_object"},
                        extra_body={"provider": {"order": ["cerebras"]}},
                        api_key=api_key,
                        timeout=6
                    )
                    raw_content = response.choices[0].message.content
                    if raw_content:
                        clean_str = _clean_json_content(str(raw_content))
                        parsed = json.loads(clean_str)
                        if isinstance(parsed, dict) and "reply" in parsed and "updated_fields" in parsed:
                            uf = parsed.get("updated_fields", {})
                            if isinstance(uf, dict):
                                if "party1" in uf and isinstance(uf["party1"], dict):
                                    uf["party1"] = _merge_party_data(current_data.get("party1", {}), uf["party1"])
                                if "party2" in uf and isinstance(uf["party2"], dict):
                                    uf["party2"] = _merge_party_data(current_data.get("party2", {}), uf["party2"])
                                return {
                                    "reply": str(parsed.get("reply", "Updates applied successfully.")),
                                    "updated_fields": uf,
                                    "status": "success"
                                }
                except Exception:
                    continue

    # 2. Rule-based NLP extraction fallback engine
    updated_fields: Dict[str, Any] = {}
    updates_summary: List[str] = []
    text = last_user_msg or ""

    # State / Location detection using canonical state list
    matched_state = None
    lower_text = text.lower()
    for st in US_STATES:
        pattern = r'\b' + re.escape(st.lower()) + r'\b'
        if re.search(pattern, lower_text):
            matched_state = st
            break

    # Determine state context (Party 1, Party 2, or Governing Law)
    if matched_state:
        if any(term in lower_text for term in ["party 1", "first party", "our company", "we are"]):
            p1_dict = _merge_party_data(current_data.get("party1", {}), updated_fields.get("party1", {}))
            p1_dict["state"] = matched_state
            updated_fields["party1"] = p1_dict
            updates_summary.append(f"Party 1 State set to {matched_state}")
        elif any(term in lower_text for term in ["party 2", "second party", "other party", "partner"]):
            p2_dict = _merge_party_data(current_data.get("party2", {}), updated_fields.get("party2", {}))
            p2_dict["state"] = matched_state
            updated_fields["party2"] = p2_dict
            updates_summary.append(f"Party 2 State set to {matched_state}")
        else:
            updated_fields["governingLawState"] = matched_state
            updated_fields["jurisdiction"] = f"State and Federal Courts in {matched_state}"
            updates_summary.append(f"Governing Law set to {matched_state}")

    # Governing law explicit extraction override
    state_match = re.search(
        r'(?:governing\s+law(?:\s+state)?|governing\s+state|law\s+of|jurisdiction)\s+(?:is|to|=|\:)?\s*([A-Za-z\s]+?)(?:\,|\.|\n|$|and)',
        text, re.IGNORECASE
    )
    if state_match:
        raw_state = state_match.group(1).strip()
        for st in US_STATES:
            if st.lower() in raw_state.lower():
                updated_fields["governingLawState"] = st
                updated_fields["jurisdiction"] = f"State and Federal Courts in {st}"
                if f"Governing Law set to {st}" not in updates_summary:
                    updates_summary.append(f"Governing Law set to {st}")
                break

    # Party 1 Name detection
    p1_name_match = re.search(
        r'(?:party\s*1|first\s+party|our\s+company|we\s+are|set\s+party\s*1)\s+(?:name\s+)?(?:is|to|=|\:)?\s*([A-Za-z0-9\s,\.]+?)(?:\.|\,|\n|$|\band\b|located|type|state)',
        text, re.IGNORECASE
    )
    if p1_name_match:
        p1_name = p1_name_match.group(1).strip()
        p1_name = re.sub(r'^(?:to|is|=|\:)\s+', '', p1_name, flags=re.IGNORECASE).strip()
        p1_name = re.sub(r'\s+and$', '', p1_name, flags=re.IGNORECASE).strip()
        if p1_name and len(p1_name) > 1 and not p1_name.lower().startswith("name"):
            p1_dict = _merge_party_data(current_data.get("party1", {}), updated_fields.get("party1", {}))
            p1_dict["name"] = p1_name
            updated_fields["party1"] = p1_dict
            updates_summary.append(f"Party 1 Name set to '{p1_name}'")

    # Party 2 Name detection
    p2_name_match = re.search(
        r'(?:party\s*2|second\s+party|other\s+party|they\s+are|partner|set\s+party\s*2)\s+(?:name\s+)?(?:is|to|=|\:)?\s*([A-Za-z0-9\s,\.]+?)(?:\.|\,|\n|$|\band\b|located|type|state)',
        text, re.IGNORECASE
    )
    if p2_name_match:
        p2_name = p2_name_match.group(1).strip()
        p2_name = re.sub(r'^(?:to|is|=|\:)\s+', '', p2_name, flags=re.IGNORECASE).strip()
        p2_name = re.sub(r'\s+and$', '', p2_name, flags=re.IGNORECASE).strip()
        if p2_name and len(p2_name) > 1 and not p2_name.lower().startswith("name"):
            p2_dict = _merge_party_data(current_data.get("party2", {}), updated_fields.get("party2", {}))
            p2_dict["name"] = p2_name
            updated_fields["party2"] = p2_dict
            updates_summary.append(f"Party 2 Name set to '{p2_name}'")

    # Party 1 / Party 2 Type, Signer, Address, Email extractions
    for p_num, p_key, p_name in [("1", "party1", "Party 1"), ("2", "party2", "Party 2")]:
        p_type_match = re.search(
            rf'(?:party\s*{p_num}|{"first" if p_num == "1" else "second"}\s+party)\s+type\s+(?:is|to|=|\:)?\s*([A-Za-z0-9\.\s]+?)(?:\,|\.|\n|$|\band\b)',
            text, re.IGNORECASE
        )
        if p_type_match:
            p_type = p_type_match.group(1).strip()
            if p_type:
                p_dict = _merge_party_data(current_data.get(p_key, {}), updated_fields.get(p_key, {}))
                p_dict["type"] = p_type
                updated_fields[p_key] = p_dict
                updates_summary.append(f"{p_name} Type set to '{p_type}'")

        p_signer_match = re.search(
            rf'(?:party\s*{p_num}|{"first" if p_num == "1" else "second"}\s+party)\s+signer\s+title\s+(?:is|to|=|\:)?\s*([A-Za-z0-9\.\s]+?)(?:\,|\.|\n|$|\band\b)',
            text, re.IGNORECASE
        )
        if p_signer_match:
            p_signer = p_signer_match.group(1).strip()
            if p_signer:
                p_dict = _merge_party_data(current_data.get(p_key, {}), updated_fields.get(p_key, {}))
                p_dict["signerTitle"] = p_signer
                updated_fields[p_key] = p_dict
                updates_summary.append(f"{p_name} Signer Title set to '{p_signer}'")

    # Purpose detection
    purpose_match = re.search(r'(?:purpose|evaluating|purpose\s+is|set\s+purpose\s+to)\s+(?:is|to)?\s*(.+?)(?:\.|\n|$)', text, re.IGNORECASE)
    if purpose_match:
        purp = purpose_match.group(1).strip()
        purp = re.sub(r'^(?:to|is|=|\:)\s+', '', purp, flags=re.IGNORECASE).strip()
        if len(purp) > 3 and not purp.lower().startswith("party"):
            updated_fields["purpose"] = purp
            updates_summary.append(f"Purpose updated to '{purp}'")

    # Confidentiality term detection
    conf_year_match = re.search(r'(?:confidentiality\s*(?:term)?|confidentiality\s+period)\s*(?:is|to|=|:)?\s*(?:for\s+)?(\d+)\s*year[s]?', text, re.IGNORECASE)
    if "perpetuity" in text.lower() or "perpetual" in text.lower():
        updated_fields["confidentialityTerm"] = "perpetuity"
        updates_summary.append("Confidentiality Term set to Perpetuity")
    elif conf_year_match:
        c_years = int(conf_year_match.group(1))
        updated_fields["confidentialityTerm"] = "fixed"
        updated_fields["confidentialityTermYears"] = c_years
        updates_summary.append(f"Confidentiality Term set to {c_years} Years Fixed")
    elif "fixed" in text.lower():
        updated_fields["confidentialityTerm"] = "fixed"
        updated_fields["confidentialityTermYears"] = 5
        updates_summary.append("Confidentiality Term set to 5 Years Fixed")

    # Agreement term years detection (ensure confidentiality term isn't mistaken for agreement term)
    if "confidentiality" not in text.lower():
        term_match = re.search(
            r'(?:agreement\s+term|term\s+of\s+(?:the\s+)?agreement|agreement\s+duration|term\s+is|term\s+to|term\s+for|agreement\s+for|set\s+term\s+to)\s*(?:is|to|=|:)?\s*(\d+)\s*year[s]?',
            text, re.IGNORECASE
        )
        if not term_match:
            term_match = re.search(r'(\d+)\s*year[s]?\s*(?:agreement|term)', text, re.IGNORECASE)
        if not term_match:
            term_match = re.search(r'(\d+)\s+year[s]?', text, re.IGNORECASE)
    else:
        term_match = re.search(
            r'(?:agreement\s+term|term\s+of\s+(?:the\s+)?agreement|agreement\s+duration)\s*(?:is|to|=|:)?\s*(\d+)\s*year[s]?',
            text, re.IGNORECASE
        )

    if term_match:
        years = int(term_match.group(1))
        updated_fields["agreementTermYears"] = years
        updates_summary.append(f"Agreement Term set to {years} years")

    # Final party data merge with current_data
    if "party1" in updated_fields and isinstance(updated_fields["party1"], dict):
        updated_fields["party1"] = _merge_party_data(current_data.get("party1", {}), updated_fields["party1"])
    if "party2" in updated_fields and isinstance(updated_fields["party2"], dict):
        updated_fields["party2"] = _merge_party_data(current_data.get("party2", {}), updated_fields["party2"])

    if updates_summary:
        reply_text = f"Got it! I've updated your legal document with: {', '.join(updates_summary)}. What else would you like to customize?"
    else:
        reply_text = "I'm ready to help you customize your Common Paper legal document! You can specify Party details (Company names, entity types, addresses), Purpose of sharing confidential information, Agreement Term, or Governing Law state."

    return {
        "reply": reply_text,
        "updated_fields": updated_fields,
        "status": "success"
    }

