FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy project files
COPY . .

# Create required directories
RUN mkdir -p public styles

# Create empty .env.local if it doesn't exist
RUN touch .env.local

# Start development server
CMD ["npm", "run", "dev"]