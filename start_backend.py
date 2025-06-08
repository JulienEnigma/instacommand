#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, '/home/ubuntu/instacommand')

from backend.main import app
import uvicorn

if __name__ == "__main__":
    print("Starting Social Commander Backend...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
