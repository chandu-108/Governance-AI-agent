import requests
import logging
from fastapi import HTTPException, status
from app.opa.config import OPA_URL, OPA_POLICY_PACKAGE

logger = logging.getLogger(__name__)


class OPAClient:
    def __init__(
        self,
        base_url: str = OPA_URL,
        package: str = OPA_POLICY_PACKAGE
    ):
        self.base_url = base_url.rstrip("/")
        self.package = package

    def health_check(self) -> bool:
        try:
            response = requests.get(f"{self.base_url}/health", timeout=3)
            return response.status_code == 200
        except requests.RequestException as e:
            logger.error(f"OPA health check failed: {e}")
            return False

    def send_request(self, path: str, data: dict) -> dict:
        url = f"{self.base_url}/v1/data/{self.package}/{path}"
        try:
            response = requests.post(url, json={"input": data}, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.Timeout as e:
            logger.error(f"OPA request timed out: {e}")
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="OPA Request Timeout"
            )
        except requests.HTTPError as e:
            logger.error(f"OPA HTTP error: {e}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="OPA returned an invalid response"
            )
        except requests.RequestException as e:
            logger.error(f"OPA Connection failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="OPA Server Unavailable"
            )

    def check_policy(self, policy_name: str, input_data: dict) -> dict:
        result = self.send_request(policy_name, input_data)
        return result.get("result", {})

    def evaluate(self, context: dict) -> dict:
        try:
            # Query the package root (e.g. /v1/data/governance)
            res = self.send_request("", context)
            result = res.get("result", {})
            allowed = result.get("allow", False)
            reason = result.get("reason", "OPA rules not loaded or evaluation failed")
            return {"allowed": allowed, "reason": reason}
        except HTTPException as e:
            logger.error(f"OPA evaluation failed, defaulting to DENY: {e.detail}")
            return {
                "allowed": False,
                "reason": f"OPA Connection Error: {e.detail}"
            }
        except Exception as e:
            logger.error(f"OPA evaluation failed, defaulting to DENY: {e}")
            return {
                "allowed": False,
                "reason": f"OPA Connection Error: {str(e)}"
            }
