import pytest
from unittest.mock import patch, MagicMock
from app.ai_chat import process_ai_chat, AIChatResponseSchema

def test_ai_chat_rule_fallback_party1():
    messages = [{"role": "user", "content": "Set Party 1 name to Acme Corp"}]
    res = process_ai_chat(messages, {})
    assert res["status"] == "success"
    assert res["updated_fields"]["party1"]["name"] == "Acme Corp"
    assert "Acme Corp" in res["reply"]

def test_ai_chat_rule_fallback_party2():
    messages = [{"role": "user", "content": "Set Party 2 name to Beta LLC"}]
    res = process_ai_chat(messages, {})
    assert res["status"] == "success"
    assert res["updated_fields"]["party2"]["name"] == "Beta LLC"

def test_ai_chat_rule_fallback_governing_law():
    messages = [{"role": "user", "content": "Set governing law state to Delaware"}]
    res = process_ai_chat(messages, {})
    assert res["status"] == "success"
    assert res["updated_fields"]["governingLawState"] == "Delaware"
    assert "Delaware" in res["updated_fields"]["jurisdiction"]

def test_ai_chat_rule_fallback_confidentiality_term():
    messages = [{"role": "user", "content": "Set confidentiality term to Perpetuity"}]
    res = process_ai_chat(messages, {})
    assert res["status"] == "success"
    assert res["updated_fields"]["confidentialityTerm"] == "perpetuity"

def test_ai_chat_merge_existing_data():
    current_data = {
        "party1": {"name": "Existing Inc", "state": "Delaware", "signerTitle": "CEO"}
    }
    messages = [{"role": "user", "content": "Set Party 1 name to Acme Corp"}]
    res = process_ai_chat(messages, current_data)
    assert res["status"] == "success"
    assert res["updated_fields"]["party1"]["name"] == "Acme Corp"
    assert res["updated_fields"]["party1"]["state"] == "Delaware"
    assert res["updated_fields"]["party1"]["signerTitle"] == "CEO"

@patch("app.ai_chat.litellm.completion")
def test_ai_chat_litellm_success(mock_completion):
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content='{"reply": "LLM response applied", "updated_fields": {"purpose": "Evaluating partnership"}}'))
    ]
    mock_completion.return_value = mock_response

    with patch("app.ai_chat._get_openrouter_api_key", return_value="sk-or-valid-test-key"):
        res = process_ai_chat([{"role": "user", "content": "Hello"}], {})
        assert res["status"] == "success"
        assert res["reply"] == "LLM response applied"
        assert res["updated_fields"]["purpose"] == "Evaluating partnership"


@patch("app.ai_chat.litellm.completion")
def test_ai_chat_litellm_markdown_json_cleaning(mock_completion):
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content='```json\n{"reply": "Markdown cleaned", "updated_fields": {"agreementTermYears": 3}}\n```'))
    ]
    mock_completion.return_value = mock_response

    with patch("app.ai_chat._get_openrouter_api_key", return_value="sk-or-valid-test-key"):
        res = process_ai_chat([{"role": "user", "content": "Hello"}], {})
        assert res["status"] == "success"
        assert res["reply"] == "Markdown cleaned"
        assert res["updated_fields"]["agreementTermYears"] == 3


def test_ai_chat_multi_word_state():
    messages = [{"role": "user", "content": "Set governing law state to New York"}]
    res = process_ai_chat(messages, {})
    assert res["status"] == "success"
    assert res["updated_fields"]["governingLawState"] == "New York"
    assert "State and Federal Courts in New York" in res["updated_fields"]["jurisdiction"]


def test_ai_chat_confidentiality_years_separation():
    messages = [{"role": "user", "content": "Set confidentiality term to 3 years"}]
    res = process_ai_chat(messages, {})
    assert res["status"] == "success"
    assert res["updated_fields"]["confidentialityTerm"] == "fixed"
    assert res["updated_fields"]["confidentialityTermYears"] == 3
    assert "agreementTermYears" not in res["updated_fields"]


def test_ai_chat_party_type_and_signer_title():
    messages = [{"role": "user", "content": "Set Party 1 type to LLC and Party 1 signer title to CEO"}]
    res = process_ai_chat(messages, {})
    assert res["status"] == "success"
    assert res["updated_fields"]["party1"]["type"] == "LLC"
    assert res["updated_fields"]["party1"]["signerTitle"] == "CEO"


def test_ai_chat_empty_messages():
    res = process_ai_chat(None, None)
    assert res["status"] == "success"
    assert "ready to help" in res["reply"].lower()

