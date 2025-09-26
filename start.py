#!/usr/bin/env python3
"""
Startup script for the FastAPI application
"""
import os
import sys
import uvicorn
from dotenv import load_dotenv

def main():
    # Load environment variables
    load_dotenv()
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("NODE_ENV", "development") == "development"
    
    print(f"Starting FastAPI server on {host}:{port}")
    print(f"Environment: {os.getenv('NODE_ENV', 'development')}")
    print(f"Reload mode: {reload}")
    
    # Start the server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )

if __name__ == "__main__":
    main()
