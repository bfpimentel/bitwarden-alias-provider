import requests

from flask import jsonify
from providers.provider import Provider


class PurelymailProvider(Provider):
    def __init__(self, api_key):
        self.api_key = api_key

    def add(self, domain, destination, alias):
        try:
            body = {
                "domainName": domain,
                "prefix": True,
                "matchUser": alias,
                "targetAddresses": [destination],
                "catchall": False,
            }

            endpoint, headers = self._build_request("v0/createRoutingRule")

            response = requests.post(endpoint, headers=headers, json=body)
            response.raise_for_status()

            return {"data": {"email": f"{alias}@{domain}"}}, response.status_code
        except ValueError as e:
            return jsonify({"error": str(e)}), 412
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500

    def get(self, domain):
        try:
            result = self._get_list(domain)
            return jsonify(result), 200
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500

    def delete(self, email):
        endpoint, headers = self._build_request("v0/deleteRoutingRule")

        try:
            _, domain = email.split("@")

            existing_aliases = self._get_list(domain)
            id_for_deletion = next(
                (alias for alias in existing_aliases if alias["email"] == email), None
            )

            response = requests.post(
                endpoint, headers=headers, json={"routingRuleId": id_for_deletion}
            )
            response.raise_for_status()

            return jsonify({"message": f"{email} deleted."}), 200
        except ValueError:
            return jsonify({"error": "Invalid email format."}), 400
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500

    def _build_request(self, path):
        endpoint = f"https://purelymail.com/api/{path}"
        headers = {
            "Purelymail-Api-Token": self.api_key,
            "Content-Type": "application/json",
        }

        return endpoint, headers

    def _get_list(self, domain):
        endpoint, headers = self._build_request("v0/listRoutingRules")

        response = requests.post(endpoint, headers=headers, json={})

        data = response.json()["result"]["rules"]

        result = [
            {
                "id": alias["id"],
                "email": f"{alias['matchUser']}@{alias['domainName']}",
                "destinations": alias["targetAddresses"],
            }
            for alias in data
            if alias["domainName"] == domain
        ]

        return result
