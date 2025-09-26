import os
import logging
from twilio.rest import Client
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Initialize Twilio client
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")

if not account_sid or not auth_token:
    logger.warning("Twilio credentials not found in environment variables")
    client = None
else:
    client = Client(account_sid, auth_token)

async def init_twilio() -> List[Dict[str, Any]]:
    """Initialize Twilio and get recent messages"""
    try:
        if not client:
            logger.warning("Twilio client not initialized")
            return []
        
        # Get recent messages
        messages = client.messages.list(limit=100)
        
        # Convert to list of dictionaries
        message_list = []
        for message in messages:
            message_dict = {
                "sid": message.sid,
                "from": message.from_,
                "to": message.to,
                "body": message.body,
                "status": message.status,
                "date_created": message.date_created.isoformat() if message.date_created else None,
                "date_sent": message.date_sent.isoformat() if message.date_sent else None,
                "direction": message.direction,
                "price": message.price,
                "price_unit": message.price_unit
            }
            message_list.append(message_dict)
        
        logger.info(f"Retrieved {len(message_list)} messages from Twilio")
        return message_list
        
    except Exception as e:
        logger.error(f"Error initializing Twilio: {e}")
        return []

async def send_sms(to: str, body: str, from_number: str = None) -> Dict[str, Any]:
    """Send an SMS message"""
    try:
        if not client:
            raise RuntimeError("Twilio client not initialized")
        
        # Use default from number if not provided
        if not from_number:
            from_number = os.getenv("TWILIO_PHONE_NUMBER")
            if not from_number:
                raise ValueError("No from number provided and TWILIO_PHONE_NUMBER not set")
        
        message = client.messages.create(
            body=body,
            from_=from_number,
            to=to
        )
        
        result = {
            "sid": message.sid,
            "status": message.status,
            "from": message.from_,
            "to": message.to,
            "body": message.body,
            "date_created": message.date_created.isoformat() if message.date_created else None
        }
        
        logger.info(f"SMS sent successfully: {result['sid']}")
        return result
        
    except Exception as e:
        logger.error(f"Error sending SMS: {e}")
        raise

async def get_message_by_sid(sid: str) -> Dict[str, Any]:
    """Get a specific message by SID"""
    try:
        if not client:
            raise RuntimeError("Twilio client not initialized")
        
        message = client.messages(sid).fetch()
        
        result = {
            "sid": message.sid,
            "from": message.from_,
            "to": message.to,
            "body": message.body,
            "status": message.status,
            "date_created": message.date_created.isoformat() if message.date_created else None,
            "date_sent": message.date_sent.isoformat() if message.date_sent else None,
            "direction": message.direction,
            "price": message.price,
            "price_unit": message.price_unit
        }
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting message by SID: {e}")
        raise

async def get_account_info() -> Dict[str, Any]:
    """Get Twilio account information"""
    try:
        if not client:
            raise RuntimeError("Twilio client not initialized")
        
        account = client.api.accounts(account_sid).fetch()
        
        result = {
            "sid": account.sid,
            "friendly_name": account.friendly_name,
            "status": account.status,
            "type": account.type,
            "date_created": account.date_created.isoformat() if account.date_created else None
        }
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting account info: {e}")
        raise
