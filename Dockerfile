# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies + Node.js 20
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc g++ curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy package.json and install Node dependencies
COPY package.json .
RUN npm install --omit=dev

# Copy application code
COPY . .

# Create public directory if it doesn't exist
RUN mkdir -p public

# Make start script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
# Set SERVER_TYPE=hypercorn to use hypercorn (supports large uploads up to 100MB)
# Default is uvicorn which has a ~1MB limit
ENV SERVER_TYPE=hypercorn
CMD ["sh", "/app/start.sh"]
