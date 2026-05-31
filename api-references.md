# Pulama Farm API Reference

A comprehensive reference guide for the Pulama Farm Order API endpoints, request/response formats, and usage examples.

---

## Base URL

```
http://localhost:5000/api
```

> **Note:** Replace `localhost:5000` with your production server URL when deploying.

---

## Table of Contents

| # | Endpoint | Method | Description |
|---|----------|--------|-------------|
| 1 | [`/api/health`](#1-health-check) | `GET` | Health check endpoint |
| 2 | [`/api/orders`](#2-create-order) | `POST` | Create a new order |
| 3 | [`/api/orders/<order_id>`](#3-get-order-by-id) | `GET` | Get order details by ID |
| 4 | [`/api/orders`](#4-get-all-orders) | `GET` | Get all orders (Admin) |
| 5 | [`/api/orders/<order_id>/status`](#5-update-order-status) | `PUT` | Update order status (Admin) |

---

## 1. Health Check

Check if the API service is running and healthy.

### Endpoint

```
GET /api/health
```

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | No |

### Query Parameters

None.

### Response

**Status Code:** `200 OK`

**Response Body:**

```json
{
  "status": "healthy",
  "service": "Pulama Farm Order API",
  "timestamp": "2026-05-31T10:57:00.000000"
}
```

### Usage Example

```bash
curl http://localhost:5000/api/health
```

---

## 2. Create Order

Place a new order through the API. This endpoint validates all required fields and prevents duplicate orders from the same email address.

### Endpoint

```
POST /api/orders
```

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | Yes |

### Request Body

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "(555) 123-4567",
  "shipping_address_line1": "123 Main Street",
  "shipping_address_line2": "Apt 4B",
  "city": "Los Angeles",
  "state": "CA",
  "zip_code": "90001",
  "country": "United States",
  "special_instructions": "Please deliver before 5 PM.",
  "items": [
    {
      "product_name": "Organic Basil",
      "quantity": 3,
      "price": 4.99
    },
    {
      "product_name": "Fresh Mint",
      "quantity": 2,
      "price": 3.99
    }
  ]
}
```

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `first_name` | string | Yes | Customer's first name |
| `last_name` | string | Yes | Customer's last name |
| `email` | string | Yes | Valid email address (must contain `@` and `.`) |
| `phone` | string | Yes | Phone number (minimum 7 digits) |
| `shipping_address_line1` | string | Yes | Primary shipping address |
| `city` | string | Yes | City name |
| `state` | string | Yes | State/Province code or name |
| `zip_code` | string | Yes | ZIP/Postal code (format: `12345` or `12345-6789`) |
| `items` | array | Yes | Array of at least one order item |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `shipping_address_line2` | string | `""` | Secondary address (apt, suite, etc.) |
| `country` | string | `"United States"` | Country name |
| `special_instructions` | string | `""` | Special delivery notes |

### Items Array Schema

Each item in the `items` array must contain:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_name` | string | Yes | Name of the product |
| `quantity` | integer | Yes | Quantity ordered (minimum 1) |
| `price` | number | Yes | Unit price (must be >= 0) |

### Response — Success

**Status Code:** `201 Created`

```json
{
  "success": true,
  "message": "Order placed successfully",
  "order_id": 1,
  "total_amount": 24.95
}
```

> The `total_amount` is automatically calculated as the sum of `(quantity × price)` for all items.

### Response — Validation Error

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "first_name is required",
    "Invalid email format",
    "At least one item is required"
  ]
}
```

### Response — Duplicate Order

**Status Code:** `409 Conflict`

```json
{
  "success": false,
  "message": "An order with this email already exists. Please contact us directly."
}
```

### Usage Examples

```bash
# Create a new order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "phone": "555-1234567",
    "shipping_address_line1": "456 Oak Ave",
    "city": "San Francisco",
    "state": "CA",
    "zip_code": "94102",
    "items": [
      {"product_name": "Organic Basil", "quantity": 5, "price": 4.99}
    ]
  }'
```

---

## 3. Get Order by ID

Retrieve detailed information about a specific order including its items.

### Endpoint

```
GET /api/orders/<order_id>
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `order_id` | integer | Yes | The unique ID of the order |

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Accept | `application/json` | No |

### Query Parameters

None.

### Response — Success

**Status Code:** `200 OK`

```json
{
  "success": true,
  "order": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567",
    "shipping_address_line1": "123 Main Street",
    "shipping_address_line2": "Apt 4B",
    "city": "Los Angeles",
    "state": "CA",
    "zip_code": "90001",
    "country": "United States",
    "total_amount": 24.95,
    "status": "pending",
    "special_instructions": "Please deliver before 5 PM.",
    "created_at": "2026-05-31T10:57:00",
    "updated_at": "2026-05-31T10:57:00",
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_name": "Organic Basil",
        "quantity": 3,
        "price": 4.99,
        "subtotal": 14.97,
        "created_at": "2026-05-31T10:57:00"
      },
      {
        "id": 2,
        "order_id": 1,
        "product_name": "Fresh Mint",
        "quantity": 2,
        "price": 3.99,
        "subtotal": 7.98,
        "created_at": "2026-05-31T10:57:00"
      }
    ]
  }
}
```

### Response — Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "Order not found"
}
```

### Usage Examples

```bash
# Get order with ID 1
curl http://localhost:5000/api/orders/1
```

---

## 4. Get All Orders

Retrieve a list of all orders. Supports filtering by status and email. This is an admin-oriented endpoint.

### Endpoint

```
GET /api/orders
```

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Accept | `application/json` | No |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by order status (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`) |
| `email` | string | No | Filter by email (supports partial match / substring search) |

### Response — Success

**Status Code:** `200 OK`

```json
{
  "success": true,
  "orders": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "(555) 123-4567",
      "shipping_address_line1": "123 Main Street",
      "shipping_address_line2": null,
      "city": "Los Angeles",
      "state": "CA",
      "zip_code": "90001",
      "country": "United States",
      "total_amount": 24.95,
      "status": "pending",
      "special_instructions": null,
      "created_at": "2026-05-31T10:57:00",
      "updated_at": "2026-05-31T10:57:00"
    },
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "phone": "(555) 987-6543",
      "shipping_address_line1": "789 Pine Rd",
      "shipping_address_line2": null,
      "city": "San Francisco",
      "state": "CA",
      "zip_code": "94102",
      "country": "United States",
      "total_amount": 15.99,
      "status": "confirmed",
      "special_instructions": null,
      "created_at": "2026-05-31T11:30:00",
      "updated_at": "2026-05-31T12:00:00"
    }
  ]
}
```

### Usage Examples

```bash
# Get all orders
curl http://localhost:5000/api/orders

# Filter by status
curl "http://localhost:5000/api/orders?status=pending"

# Filter by email (partial match)
curl "http://localhost:5000/api/orders?email=john"

# Combine filters
curl "http://localhost:5000/api/orders?status=confirmed&email=smith"
```

---

## 5. Update Order Status

Update the status of an existing order. This is an admin-oriented endpoint.

### Endpoint

```
PUT /api/orders/<order_id>/status
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `order_id` | integer | Yes | The unique ID of the order |

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | Yes |

### Request Body

```json
{
  "status": "confirmed"
}
```

### Valid Status Values

| Status | Description |
|--------|-------------|
| `pending` | Order received, awaiting confirmation |
| `confirmed` | Order confirmed |
| `processing` | Order is being processed/packed |
| `shipped` | Order has been shipped |
| `delivered` | Order has been delivered to customer |
| `cancelled` | Order has been cancelled |

### Response — Success

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Order status updated to confirmed"
}
```

### Response — Invalid Status

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid status. Must be one of: pending, confirmed, processing, shipped, delivered, cancelled"
}
```

### Response — Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "Order not found"
}
```

### Usage Examples

```bash
# Update order status to confirmed
curl -X PUT http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'

# Update order status to shipped
curl -X PUT http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

---

## Error Response Format

All error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `false` for error responses |
| `message` | string | Human-readable error summary |
| `errors` | array | (Optional) Array of detailed validation errors |

### HTTP Status Code Summary

| Code | Meaning |
|------|---------|
| `200 OK` | Request succeeded (GET, PUT) |
| `201 Created` | Order successfully created (POST) |
| `400 Bad Request` | Invalid request data or validation failure |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Duplicate order (same email) |
| `500 Internal Server Error` | Unexpected server error |

---

## Database Schema

### `orders` Table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `first_name` | TEXT | NOT NULL |
| `last_name` | TEXT | NOT NULL |
| `email` | TEXT | NOT NULL, indexed |
| `phone` | TEXT | NOT NULL |
| `shipping_address_line1` | TEXT | NOT NULL |
| `shipping_address_line2` | TEXT | nullable |
| `city` | TEXT | NOT NULL |
| `state` | TEXT | NOT NULL |
| `zip_code` | TEXT | NOT NULL, indexed |
| `country` | TEXT | DEFAULT 'United States' |
| `total_amount` | REAL | NOT NULL |
| `status` | TEXT | DEFAULT 'pending', indexed |
| `special_instructions` | TEXT | nullable |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### `order_items` Table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `order_id` | INTEGER | NOT NULL, FOREIGN KEY (cascading delete) |
| `product_name` | TEXT | NOT NULL |
| `quantity` | INTEGER | NOT NULL |
| `price` | REAL | NOT NULL |
| `subtotal` | REAL | NOT NULL |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Running the API Server

To start the API server locally:

```bash
cd api
pip install -r requirements.txt
python app.py
```

The server will start on `http://0.0.0.0:5000`.

### Dependencies

- **Flask** — Web framework
- **flask-cors** — Cross-Origin Resource Sharing support

See [`api/requirements.txt`](api/requirements.txt) for full dependency list.