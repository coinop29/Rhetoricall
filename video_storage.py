"""
Video storage service - supports local filesystem or Cloudinary based on USE_LOCAL_VIDEO_STORAGE flag.
"""
import os
import io
import logging
from typing import Tuple, Optional

logger = logging.getLogger(__name__)

# Load env early for the flag
from dotenv import load_dotenv
load_dotenv()

USE_LOCAL_VIDEO_STORAGE = os.getenv("USE_LOCAL_VIDEO_STORAGE", "true").lower() in ("true", "1", "yes")


def is_local_storage() -> bool:
    """Return True if using local storage, False for Cloudinary."""
    return USE_LOCAL_VIDEO_STORAGE


async def upload_video(file_content: bytes, filename: str) -> Tuple[str, str, Optional[str]]:
    """
    Upload video to storage. Returns (url, filename, cloudinary_public_id or None).
    - Local: saves to static/media, returns (/static/media/filename, filename, None)
    - Cloudinary: uploads to Cloudinary, returns (secure_url, filename, public_id)
    """
    if USE_LOCAL_VIDEO_STORAGE:
        return await _upload_local(file_content, filename)
    else:
        return await _upload_cloudinary(file_content, filename)


async def _upload_local(file_content: bytes, filename: str) -> Tuple[str, str, Optional[str]]:
    """Save video to local static/media directory."""
    os.makedirs("static/media", exist_ok=True)
    file_path = f"static/media/{filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)
    logger.info(f"Video saved locally: {file_path}")
    file_url = f"/static/media/{filename}"
    return (file_url, filename, None)


async def _upload_cloudinary(file_content: bytes, filename: str) -> Tuple[str, str, Optional[str]]:
    """Upload video to Cloudinary."""
    try:
        import cloudinary
        import cloudinary.uploader
    except ImportError:
        raise RuntimeError(
            "Cloudinary storage is enabled but cloudinary package is not installed. "
            "Run: pip install cloudinary"
        )

    # Configure from env (CLOUDINARY_URL or individual vars)
    if os.getenv("CLOUDINARY_URL"):
        cloudinary.config(secure=True)
    else:
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET"),
            secure=True
        )

    if not (os.getenv("CLOUDINARY_URL") or all([os.getenv("CLOUDINARY_CLOUD_NAME"), os.getenv("CLOUDINARY_API_KEY"), os.getenv("CLOUDINARY_API_SECRET")])):
        raise RuntimeError(
            "Cloudinary storage is enabled but CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, "
            "and CLOUDINARY_API_SECRET must be set in .env"
        )

    # Use BytesIO for in-memory upload
    file_obj = io.BytesIO(file_content)
    # Remove extension for public_id (Cloudinary convention)
    base_name = os.path.splitext(filename)[0]
    folder = os.getenv("CLOUDINARY_VIDEO_FOLDER", "background_videos")

    # Use upload_large for videos > 20MB (chunked upload), else upload
    use_large = len(file_content) > 20 * 1024 * 1024
    if use_large:
        import tempfile
        with tempfile.NamedTemporaryFile(suffix=os.path.splitext(filename)[1], delete=False) as tmp:
            tmp.write(file_content)
            tmp_path = tmp.name
        try:
            result = cloudinary.uploader.upload_large(
                tmp_path,
                resource_type="video",
                folder=folder,
                public_id=base_name,
                chunk_size=6_000_000,
            )
        finally:
            os.unlink(tmp_path)
    else:
        file_obj.seek(0)
        result = cloudinary.uploader.upload(
            file_obj,
            resource_type="video",
            folder=folder,
            public_id=base_name,
        )

    secure_url = result.get("secure_url")
    public_id = result.get("public_id")
    if not secure_url or not public_id:
        raise RuntimeError(f"Cloudinary upload failed: {result}")

    logger.info(f"Video uploaded to Cloudinary: {secure_url}")
    return (secure_url, filename, public_id)


async def delete_video(url: str, filename: str, cloudinary_public_id: Optional[str] = None) -> bool:
    """
    Delete video from storage.
    - Local: removes file from static/media
    - Cloudinary: destroys asset by public_id
    """
    if USE_LOCAL_VIDEO_STORAGE:
        return _delete_local(filename)
    else:
        return await _delete_cloudinary(cloudinary_public_id, url)


def _delete_local(filename: str) -> bool:
    """Delete video from local filesystem."""
    static_path = os.path.join("static/media", filename)
    public_path = os.path.join("public", filename)
    deleted = False
    for path in [static_path, public_path]:
        try:
            if os.path.exists(path):
                os.remove(path)
                logger.info(f"Local video deleted: {path}")
                deleted = True
        except Exception as e:
            logger.error(f"Error deleting {path}: {e}")
    return deleted


async def _delete_cloudinary(public_id: Optional[str], url: str) -> bool:
    """Delete video from Cloudinary."""
    if not public_id and url:
        # Extract public_id from URL as fallback
        # Format: https://res.cloudinary.com/cloud/video/upload/v123/folder/public_id.ext
        if "cloudinary.com" in url and "/video/upload/" in url:
            try:
                parts = url.split("/video/upload/")[-1].split("/")
                if len(parts) >= 2:
                    # Skip version (v123...), rest is folder/public_id
                    public_id = "/".join(parts[1:]).rsplit(".", 1)[0]
                elif len(parts) == 1:
                    public_id = parts[0].rsplit(".", 1)[0]
            except Exception:
                pass

    if not public_id:
        logger.warning("Cannot delete from Cloudinary: no public_id available")
        return False

    try:
        import cloudinary
        import cloudinary.uploader

        if not os.getenv("CLOUDINARY_URL"):
            cloudinary.config(
                cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
                api_key=os.getenv("CLOUDINARY_API_KEY"),
                api_secret=os.getenv("CLOUDINARY_API_SECRET"),
            )
        result = cloudinary.uploader.destroy(public_id, resource_type="video")
        if result.get("result") == "ok":
            logger.info(f"Cloudinary video deleted: {public_id}")
            return True
        logger.warning(f"Cloudinary delete result: {result}")
        return False
    except Exception as e:
        logger.error(f"Error deleting from Cloudinary: {e}")
        return False
