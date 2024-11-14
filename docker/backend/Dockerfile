FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        libpq-dev \
        python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements files
COPY backend/requirements/base.txt backend/requirements/dev.txt ./requirements/

# Install Python dependencies
RUN pip install -r requirements/base.txt

# Development stage
FROM base as development

# Install development dependencies
RUN pip install -r requirements/dev.txt

# Create upload directory
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Copy backend code
COPY backend .

# Start development server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]