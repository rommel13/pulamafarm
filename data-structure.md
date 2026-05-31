# Database Data Structure

This document describes the database schema used by the Pulama Farm order management system. The application uses **SQLite** as its database with a two-table relational structure.

---

## Overview

```
┌─────────────────┐       ┌─────────────────┐
│     orders      │       │   order_items   │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ first_name      │   └──>│ order_id (FK)   │
│ last_name       │       │ product_name    │
│ email           │       │ quantity        │
│ phone           │       │ price           │
│ shipping_addr1  │       │ subtotal        │
│ shipping_addr2  │       │ created_at      │
│ city            │       └─────────────────┘
│ state           │
│ zip_code        │
│ country         │
│ total_amount    │
│ status          │
│ special_instr   │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## Table: `orders`

Stores the main order header information including customer details, shipping address, and order status.

| Column                  | Type     | Constraints                | Description                                  |
|------------------------|----------|----------------------------|----------------------------------------------|
| `id`                   | INTEGER  | PRIMARY KEY, AUTOINCREMENT | Unique order identifier                      |
| `first_name`           | TEXT     | NOT NULL                   | Customer's first name                        |
| `last_name`            | TEXT     | NOT NULL                   | Customer's last name                         |
| `email`                | TEXT     | NOT NULL                   | Customer's email address                     |
| `phone`                | TEXT     | NOT NULL                   | Customer's phone number                      |
| `shipping_address_line1`| TEXT    | NOT NULL                   | Primary shipping address line (street, P.O. Box) |
| `shipping_address_line2`| TEXT    | NULLABLE                   | Secondary address info (apt, suite, building)  |
| `city`                 | TEXT     | NOT NULL                   | City                                         |
| `state`                | TEXT     | NOT NULL                   | State / Province                             |
| `zip_code`             | TEXT     | NOT NULL                   | Postal / ZIP code                            |
| `country`              | TEXT     | NOT NULL, DEFAULT 'United States' | Country name                        |
| `total_amount`         | REAL     | NOT NULL, DEFAULT 0.0      | Total order amount in dollars                |
| `status`               | TEXT     | NOT NULL, DEFAULT 'pending'| Order status: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled` |
| `special_instructions` | TEXT     | NULLABLE                   | Customer notes or special requests           |
| `created_at`           | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | Timestamp when order was created             |
| `updated_at`           | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | Timestamp when order was last updated        |

### Sample Record

```json
{
  "id": 1,
  "first_name": "Juan",
  "last_name": "DelaCruz",
  "email": "juan.delacruz@email.com",
  "phone": "+63 917 123 4567",
  "shipping_address_line1": "123 Main St.",
  "shipping_address_line2": "Apt 4B",
  "city": "Manila",
  "state": "Metro Manila",
  "zip_code": "1000",
  "country": "United States",
  "total_amount": 85.5,
  "status": "pending",
  "special_instructions": "Please leave at the front door.",
  "created_at": "2026-05-31 10:30:00",
  "updated_at": "2026-05-31 10:30:00"
}
```

---

## Table: `order_items`

Stores individual line items within an order. Each row represents one product in the order.

| Column         | Type     | Constraints                           | Description                                  |
|---------------|----------|---------------------------------------|----------------------------------------------|
| `id`          | INTEGER  | PRIMARY KEY, AUTOINCREMENT            | Unique item identifier                       |
| `order_id`    | INTEGER  | NOT NULL, FK → orders(id) ON DELETE CASCADE | Reference to the parent order              |
| `product_name`| TEXT     | NOT NULL                              | Name of the product ordered                  |
| `quantity`    | INTEGER  | NOT NULL                              | Number of units ordered                      |
| `price`       | REAL     | NOT NULL                              | Unit price at time of order                  |
| `subtotal`    | REAL     | NOTNULL                               | quantity × price                             |
| `created_at`  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP            | Timestamp when item was added to the order   |

### Sample Record

```json
{
  "id": 1,
  "order_id": 1,
  "product_name": "Organic Rice (5kg)",
  "quantity": 2,
  "price": 25.0,
  "subtotal": 50.0,
  "created_at": "2026-05-31 10:30:00"
}
```

---

## Relationships

### One-to-Many: `orders` → `order_items`

- **Foreign Key:** `order_items.order_id` references `orders.id`
- **Cascade Rule:** Deleting an order automatically deletes all its items (`ON DELETE CASCADE`)
- **Cardinality:** One order can contain many line items; each item belongs to exactly one order.

---

## Database File

| Property     | Value                     |
|-------------|---------------------------|
| Engine       | SQLite 3                  |
| File Path    | `db/order.db`             |
| Initialization Script | `db/init_db.py`   |

### Initializing the Database

Run the following command to create (or recreate) the database schema:

```bash
python db/init_db.py
```

This script creates both tables and prints confirmation messages.

---

## Status Values

The `orders.status` field supports the following values:

| Status       | Description                                  |
|-------------|----------------------------------------------|
| `pending`    | Order has been placed, awaiting processing   |
| `confirmed`  | Order has been confirmed by the farm         |
| `shipped`    | Order has been shipped / out for delivery    |
| `delivered`  | Order has been delivered to the customer     |
| `cancelled`  | Order has been cancelled                     |

---

## Indexes

Currently, no explicit indexes are defined beyond the primary keys and foreign key constraints. SQLite automatically creates an index for each PRIMARY KEY and FOREIGN KEY column.

If query performance becomes a concern with large datasets, consider adding:

```sql
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

---

## Entity Relationship Diagram (Text)

```
orders (1) ──────< (many) order_items

orders.id = order_items.order_id  (Foreign Key, CASCADE DELETE)
```

Each entry in `order_items` must reference a valid existing order. Attempting to insert an item with a non-existent `order_id` will raise a foreign key violation error (if foreign keys are enabled).