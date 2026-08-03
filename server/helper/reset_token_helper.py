import secrets
import hashlib


def generate_reset_token():
    """
    Returns:
        raw_token  -> sent in email
        hashed_token -> stored in MongoDB
    """
    raw_token = secrets.token_urlsafe(32)

    hashed_token = hashlib.sha256(
        raw_token.encode()
    ).hexdigest()

    return raw_token, hashed_token


def hash_reset_token(token: str):
    return hashlib.sha256(
        token.encode()
    ).hexdigest()