import os
import smtplib

from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_incharge_credentials(
    recipient_email,
    name,
    username,
    password,
    incharge_id
):

    msg = EmailMessage()

    msg["Subject"] = "Library Portal - Your Incharge Account"

    msg["From"] = EMAIL_ADDRESS

    msg["To"] = recipient_email

    msg.set_content(f"""
Dear {name},

Your Library Incharge account has been created successfully.

---------------------------------------

Incharge ID : {incharge_id}

Username : {username}

Temporary Password : {password}

---------------------------------------

Please login using these credentials.

For security reasons, change your password after logging in.

Regards,
Library Portal Administrator
""")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

def send_password_reset_link(
    recipient_email,
    name,
    reset_link
):

    msg = EmailMessage()

    msg["Subject"] = "Library Portal - Reset Your Password"

    msg["From"] = EMAIL_ADDRESS

    msg["To"] = recipient_email

    msg.set_content(f"""
Dear {name},

We received a request to reset your Library Portal password.

Click the link below to reset your password:

{reset_link}

This link will expire in 15 minutes.

If you did not request this password reset, you can safely ignore this email.

Regards,
Library Portal Administrator
""")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)