import os
from fastapi import Header, HTTPException

# Read from environment variable — never hardcode secrets in source
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")


def verify_admin(x_admin_password: str = Header(None)):
    """Dependency that validates the admin password header for protected routes."""
    if not ADMIN_PASSWORD:
        raise HTTPException(
            status_code=503,
            detail="Admin access is not configured on this server."
        )
    if x_admin_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
