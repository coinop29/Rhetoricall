#!/bin/bash

# Start React development server with increased memory allocation
echo "🚀 Starting React development server with increased memory allocation..."

# Set Node.js memory options
export NODE_OPTIONS="--max-old-space-size=4096"

# Start the development server
npm start
