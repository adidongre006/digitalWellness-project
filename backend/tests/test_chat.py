async def _fake_stream_chat_reply(message, history):
    for chunk in ["Hel", "lo", " there"]:
        yield chunk


async def _fake_get_chat_reply(message, history):
    return "Hello there"


def test_chat_rejects_empty_message(client):
    response = client.post("/api/chat", json={"message": ""})
    assert response.status_code == 422


def test_chat_rejects_oversized_message(client):
    response = client.post("/api/chat", json={"message": "x" * 5000})
    assert response.status_code == 422


def test_chat_non_streaming_returns_reply(client, monkeypatch):
    monkeypatch.setattr("app.api.chat.get_chat_reply", _fake_get_chat_reply)
    response = client.post("/api/chat", json={"message": "Hi, what should I use?"})
    assert response.status_code == 200
    assert response.json()["message"] == "Hello there"


def test_chat_stream_emits_sse_events(client, monkeypatch):
    monkeypatch.setattr("app.ai.streaming.stream_chat_reply", _fake_stream_chat_reply)
    response = client.post("/api/chat/stream", json={"message": "Hi"})
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/event-stream")
    body = response.text
    assert '"delta": "Hel"' in body or '"delta":"Hel"' in body
    assert '"done": true' in body or '"done":true' in body


def test_chat_stream_reports_upstream_error_as_sse_event(client, monkeypatch):
    async def _raise(*args, **kwargs):
        raise RuntimeError("simulated upstream provider failure")
        yield  # pragma: no cover — makes this an async generator

    monkeypatch.setattr("app.ai.streaming.stream_chat_reply", _raise)
    response = client.post("/api/chat/stream", json={"message": "Hi"})
    assert response.status_code == 200
    # The raw exception message must NOT leak to the client.
    assert "simulated upstream provider failure" not in response.text
    assert '"error"' in response.text
