import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


def upload_image(file):
    result = cloudinary.uploader.upload(
        file,
        folder="library/thesis/covers"
    )
    return result["secure_url"]


def upload_pdf(file):
    result = cloudinary.uploader.upload(
        file.file,
        resource_type="auto",
        folder="library/thesis/pdfs",
        use_filename=True,
        unique_filename=False,
        overwrite=True,
        access_mode="public", signature="true",
    )

    return result["secure_url"]

def upload_avatar(file):
    result = cloudinary.uploader.upload(
        file,
        folder="library/avatars"
    )
    return result["secure_url"], result["public_id"]


def delete_asset(public_id: str):
    cloudinary.uploader.destroy(public_id)