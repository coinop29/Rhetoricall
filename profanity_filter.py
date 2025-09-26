import re
import logging
from typing import str

logger = logging.getLogger(__name__)

# Basic profanity filter - you can expand this list
PROFANITY_WORDS = {
    'bad', 'word', 'example',  # Add your profanity words here
    # Add more words as needed
}

def clean_text(text: str) -> str:
    """
    Clean profanity from text, similar to the Node.js profanity-cleaner
    """
    try:
        if not text or not isinstance(text, str):
            return text
        
        # Check if the string contains only emojis
        is_only_emoji = len(re.sub(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF\U00002702-\U000027B0\U000024C2-\U0001F251]+', '', text).strip()) == 0
        
        if is_only_emoji:
            logger.info(f"Text contains only emojis, returning original: {text}")
            return text
        
        # Simple word replacement
        words = text.split()
        cleaned_words = []
        
        for word in words:
            # Check if word contains non-emoji characters and is profane
            contains_non_emoji = len(re.sub(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF\U00002702-\U000027B0\U000024C2-\U0001F251]+', '', word).strip()) > 0
            
            if contains_non_emoji and word.lower() in PROFANITY_WORDS:
                cleaned_words.append('*' * len(word))
            else:
                cleaned_words.append(word)
        
        result = ' '.join(cleaned_words)
        logger.info(f"Text cleaned: '{text}' -> '{result}'")
        return result
        
    except Exception as error:
        logger.error(f"Error cleaning text: {error}")
        return text

def is_profane(text: str) -> bool:
    """
    Check if text contains profanity
    """
    try:
        if not text or not isinstance(text, str):
            return False
        
        words = text.lower().split()
        for word in words:
            if word in PROFANITY_WORDS:
                return True
        
        return False
        
    except Exception as error:
        logger.error(f"Error checking profanity: {error}")
        return False

def replace_word(word: str) -> str:
    """
    Replace a profane word with asterisks
    """
    return '*' * len(word)
