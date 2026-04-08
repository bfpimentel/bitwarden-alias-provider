import requests

from providers.provider import Provider


class PurelymailProvider(Provider):
    def __init__(self, server, username, api_key):
        self.api_key = api_key

    def add(domain, destination, alias):
        try:
            body = {
                "domainName": domain,
                "prefix": True,
                "matchUser": alias,
                "targetAddresses": [destination],
                "catchall": False,
            }

            endpoint, headers = _build_request("/v0/createRoutingRule")

            response = requests.post(endpoint, headers=headers, json=body)
            response.raise_for_status()

            return {"data": {"email": f"{alias}@{domain}"}}
        except ValueError as e:
            return jsonify({"error": str(e)}), 412
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500

    def get(domain):
        endpoint, headers = _build_request(domain)

        try:
            return jsonify({"error": "Not implemented yet"}), 404
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500

    def delete(email):
        try:
            alias, domain = email.split("@")
        except ValueError:
            return jsonify({"error": "Invalid email format."}), 400

        endpoint, headers = _build_request(domain)

        try:
            return jsonify({"error": "Not implemented yet"}), 404
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500

    def _build_request(path):
        endpoint = f"https://purelymail.com/api/{path}"
        headers = {
            "Purelymail-Api-Token": self.api_key,
            "Content-Type": "application/json",
        }

        return endpoint, headers
