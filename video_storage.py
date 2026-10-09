"""Store uploaded background videos in Cloudinary or local development storage."""
import io
import os


async def upload_video(content: bytes, filename: str):
    cloudinary_url = os.getenv("CLOUDINARY_URL")
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")
    if cloudinary_url or all((cloud_name, api_key, api_secret)):
        import cloudinary
        import cloudinary.uploader

        if cloudinary_url:
            cloudinary.config(secure=True)
        else:
            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret,
                secure=True,
            )
        result = cloudinary.uploader.upload(
            io.BytesIO(content),
            resource_type="video",
            folder=os.getenv("CLOUDINARY_VIDEO_FOLDER", "background_videos"),
            public_id=os.path.splitext(filename)[0],
        )
        return result["secure_url"], filename, result.get("public_id")

    os.makedirs("static/media", exist_ok=True)
    path = os.path.join("static", "media", filename)
    with open(path, "wb") as destination:
        destination.write(content)
    return f"/static/media/{filename}", filename, None
