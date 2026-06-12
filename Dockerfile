# Build stage for API (Flask)
FROM python:3.11-slim AS api-builder

WORKDIR /app/api

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Web stage for Angular
FROM node:20-alpine AS web-builder

WORKDIR /app/web

COPY package*.json ./
RUN npm install

COPY . .
RUN ng build --configuration=production --output=dist/web

# Final production image with both services
FROM nginx:alpine

# Copy API
COPY --from=api-builder /app/api/app.py /usr/local/bin/

# Copy Angular build output
COPY --from=web-builder /app/web/dist/web/browser /var/www/html/

# Expose ports
EXPOSE 8080 5000

# Start API server
CMD ["python", "/usr/local/bin/app.py"]