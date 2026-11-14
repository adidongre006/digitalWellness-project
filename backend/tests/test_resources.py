def test_list_resources(client, sample_resource):
    response = client.get("/api/resources")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["slug"] == sample_resource.slug


def test_get_resource_by_slug_found(client, sample_resource):
    response = client.get(f"/api/resources/{sample_resource.slug}")
    assert response.status_code == 200
    assert response.json()["name"] == sample_resource.name


def test_get_resource_by_slug_not_found(client):
    response = client.get("/api/resources/does-not-exist")
    assert response.status_code == 404
    assert "does-not-exist" in response.json()["detail"]
