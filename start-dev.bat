@echo off
echo 🚀 Starting React development server with increased memory allocation...

REM Set Node.js memory options
set NODE_OPTIONS=--max-old-space-size=4096

REM Start the development server
npm start
