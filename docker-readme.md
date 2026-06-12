# Pulama Farm - Docker Setup

This Docker package provides a complete deployment solution for running both the Web and API services.

## Project Structure

```
.
├── api/                  # Flask API
│   ├── app.py           # API application
│   ├── requirements.txt # Python dependencies
│   └── Dockerfile.api   # API Dockerfile
├── web/pulama-farm/     # Angular Web App
│   ├── package.json
│   ├── angular.json
│   └── Dockerfile.web   # Web Dockerfile
├── db/                   # SQLite database directory
├── nginx.conf            # Nginx reverse proxy config
├── docker-compose.yml    # Multi-container orchestration
├── Dockerfile.nginx      # Proxy Dockerfile
└── docker-readme.md     # This file
```

## Quick Start

### 1. Build all containers
```bash
docker-compose build
```

### 2. Run the services
```bash
docker-compose up -d
```

### 3. Access the applications
- **Web App**: http://localhost:80 or http://localhost:8080
- **API Health Check**: http://localhost:5000/api/health
- **API Orders Endpoint**: http://localhost:5000/api/orders

### 4. Stop all services
```bash
docker-compose down
```

### 5. Run with volume persistence (recommended for development)
```bash
docker-compose up -d --build
```

The `db/` directory is mounted for SQLite database persistence.

## Architecture

```
┌─────────────────────────────────────────┐
│         Browser / Client                 │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS Port 80
               ▼
┌─────────────────────────────────────────┐
│   Nginx Reverse Proxy (Port 80/443)     │
│   - Routes / to Web App                 │
│   - Routes /api/* to API Server         │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴────────┐
        ▼               ▼
┌─────────────┐   ┌─────────────┐
│ Web App     │   │ API Server  │
│ (Angular)   │   │ (Flask)     │
│ Port 8080   │   │ Port 5000   │
└─────────────┘   └─────────────┘
                     │
                     ▼
               ┌─────────────┐
               │ SQLite DB   │
               │ (db/)       │
               └─────────────┘
```

## Service Ports

| Service  | Port  | Description          |
|----------|-------|----------------------|
| Nginx    | 80/443| Main entry point     |
| Web App  | 8080  | Angular application  |
| API      | 5000  | Flask RESTful API    |

## Build from Scratch (without docker-compose)

### Build individual containers:
```bash
# Build Nginx proxy
docker build -f Dockerfile.nginx -t pulama-nginx .

# Build API container
cd api
docker build -f Dockerfile.api -t pulama-api .

# Navigate back and build web app
cd ../web/pulama-farm
docker build -f Dockerfile.web -t pulama-web .
```

### Run all containers:
```bash
docker run -d --name pulama-nginx \
  -p 80:80 -p 443:443 \
  pulama-nginx

docker run -d --name pulama-web \
  --link pulama-nginx:web \
  -p 8080:80 \
  pulama-web

docker run -d --name pulama-api \
  --link pulama-nginx:api \
  --volume ./db:/app/db \
  -p 5000:5000 \
  pulama-api
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/orders` | POST | Create new order |
| `/api/orders` | GET | Get all orders (admin) |
| `/api/orders?status=...` | GET | Get orders by status |
| `/api/orders?email=...` | GET | Search orders by email |
| `/api/orders/<id>` | GET | Get specific order |
| `/api/orders/<id>/status` | PUT | Update order status |

## API Documentation

### Create Order (POST /api/orders)
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "5551234567",
  "shipping_address_line1": "123 Main St",
  "city": "Honolulu",
  "state": "HI",
  "zip_code": "96740",
  "country": "United States",
  "items": [
    {
      "product_name": "Pulama Farm Bundle",
      "quantity": 2,
      "price": 29.99
    }
  ]
}
```

### Response Success (201)
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order_id": 1,
  "total_amount": 59.98
}
```

### Health Check (GET /api/health)
```json
{
  "status": "healthy",
  "service": "Pulama Farm Order API",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Troubleshooting

### Check container logs:
```bash
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f nginx-proxy
```

### Rebuild with fresh cache:
```bash
docker-compose down
docker volume prune
docker-compose build --no-cache
docker-compose up -d
```

### View running containers:
```bash
docker-compose ps
```

## Environment Variables (Optional)

You can customize the API by adding environment variables to `docker-compose.yml`:

```yaml
api:
  environment:
    - FLASK_ENV=production
    - DEBUG=false
    - SECRET_KEY=your-secret-key
```

---
**Note**: The SQLite database is stored in the `db/` directory for data persistence. Make sure this directory exists before starting the containers.