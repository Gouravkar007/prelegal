import os
import json
import re
import urllib.request
import urllib.error

def process_ai_chat(messages: list, current_data: dict = None) -> dict:
    """
    Processes freeform AI chat for Mutual NDA creation.
    1. Attempts to use OpenRouter (openrouter/openai/gpt-oss-20b model via LiteLLM API).
    2. Fallbacks gracefully to structured NLP extraction if OpenRouter key is unavailable/depleted.
    """
    if current_data is None:
        current_data = {}

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("OPENROUTER_API_KEY="):
                        api_key = line.split("=", 1)[1].strip()

    last_user_msg = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            last_user_msg = msg.get("content", "")
            break

    # Attempt OpenRouter call
    if api_key and not api_key.startswith("sk-or-dummy"):
        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "PreLegal"
            }
            
            system_prompt = (
                "You are PreLegal AI, an assistant helping users fill out a Common Paper Mutual NDA. "
                "Extract any legal fields mentioned in the conversation and return ONLY valid JSON matching this schema:\n"
                "{\n"
                '  "reply": "Friendly response acknowledging the updates and asking about remaining NDA fields.",\n'
                '  "updated_fields": {\n'
                '    "party1": {"name": "...", "type": "...", "address": "...", "email": "...", "signer": "..."}, (optional)\n'
                '    "party2": {"name": "...", "type": "...", "address": "...", "email": "...", "signer": "..."}, (optional)\n'
                '    "purpose": "...", (optional)\n'
                '    "agreementTermYears": 1, (optional)\n'
                '    "confidentialityTerm": "perpetuity" | "fixed", (optional)\n'
                '    "confidentialityTermYears": 5, (optional)\n'
                '    "governingLawState": "Delaware", (optional)\n'
                '    "jurisdiction": "State and Federal Courts in Delaware" (optional)\n'
                "  }\n"
                "}"
            )
            
            payload = {
                "model": "openrouter/openai/gpt-oss-20b",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    *[{"role": m.get("role", "user"), "content": m.get("content", "")} for m in messages]
                ],
                "response_format": {"type": "json_object"}
            }
            
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=5) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                content = res_data["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                if "reply" in parsed and "updated_fields" in parsed:
                    return parsed
        except Exception:
            # Fallback to local rule engine if API call fails or quota exceeded
            pass

    # Rule-based NLP extraction fallback engine
    updated_fields = {}
    updates_summary = []
    text = last_user_msg

    # Party 1 detection
    p1_match = re.search(r'(?:party\s*1|first\swaparty|our\s+company|we\s+are)\s+(?:is|=)?\s*([A-Za-z0-9\s,\.]+?)(?:\.|\,|\n|$|and|party|located)', text, re.IGNORECASE)
    if p1_match:
        p1_name = p1_match.group(1).strip()
        if p1_name and len(p1_name) > 1:
            updated_fields.setdefault("party1", {})["name"] = p1_name
            updates_summary.append(f"Party 1 Name set to '{p1_name}'")

    # Party 2 detection
    p2_match = re.search(r'(?:party\s*2|second\swaparty|other\s+party|they\s+are|partner)\s+(?:is|=)?\s*([A-Za-z0-9\s,\.]+?)(?:\.|\,|\n|$|and|located)', text, re.IGNORECASE)
    if p2_match:
        p2_name = p2_match.group(1).strip()
        if p2_name and len(p2_name) > 1:
            updated_fields.setdefault("party2", {})["name"] = p2_name
            updates_summary.append(f"Party 2 Name set to '{p2_name}'")

    # Purpose detection
    purpose_match = re.search(r'(?:purpose|for|evaluating)\s+(?:is|to)?\s*(.+?)(?:\.|\n|$)', text, re.IGNORECASE)
    if purpose_match:
        purp = purpose_match.group(1).strip()
        if len(purp) > 5 and not purp.lower().startswith("party"):
            updated_fields["purpose"] = purp
            updates_summary.append(f"Purpose updated")

    # Agreement term years
    term_match = re.search(r'(\d+)\s*year[s]?\s*(?:agreement|term)', text, re.IGNORECASE)
    if term_match:
        years = int(term_match.group(1))
        updated_fields["agreementTermYears"] = years
        updates_summary.append(f"Agreement Term set to {years} years")

    # Confidentiality term
    if "perpetuity" in text.lower() or "perpetual" in text.lower():
        updated_fields["confidentialityTerm"] = "perpetuity"
        updates_summary.append("Confidentiality Term set to Perpetuity")
    elif "5 year" in text.lower() or "fixed" in text.lower():
        updated_fields["confidentialityTerm"] = "fixed"
        updated_fields["confidentialityTermYears"] = 5
        updates_summary.append("Confidentiality Term set to 5 Years Fixed")

    # State / Governing law
    state_match = re.search(r'(?:governing\s+law|state\s+of|law\s+of)\s+([A-Za-z\s]+)', text, re.IGNORECASE)
    if state_match:
        state = state_match.group(1).strip()
        if state:
            updated_fields["governingLawState"] = state
            updated_fields["jurisdiction"] = f"State and Federal Courts in {state}"
            updates_summary.append(f"Governing Law set to {state}")

    if updates_summary:
        reply_text = f"Got it! I've updated the NDA with: {', '.join(updates_summary)}. Is there anything else you'd like to adjust (such as Party addresses, Governing Law state, or Purpose)?"
    else:
        reply_text = "I'm ready to help you customize your Common Paper Mutual NDA! You can tell me Party details (Company names, entity types, addresses), Purpose of sharing confidential information, Agreement Term, or Governing Law state."

    return {
        "reply": reply_text,
        "updated_fields": updated_fields,
        "status": "success"
    }
