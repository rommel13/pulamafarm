from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'db', 'order.db')

def get_db_connection():
    """Create and return a database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    """Initialize the database with required tables."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            shipping_address_line1 TEXT NOT NULL,
            shipping_address_line2 TEXT,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            zip_code TEXT NOT NULL,
            country TEXT NOT NULL DEFAULT 'United States',
            total_amount REAL NOT NULL DEFAULT 0.0,
            status TEXT NOT NULL DEFAULT 'pending',
            special_instructions TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            subtotal REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
    ''')
    
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)')
    
    conn.commit()
    conn.close()

def validate_order_data(data):
    """Validate incoming order data and return errors if any."""
    errors = []
    
    required_fields = ['first_name', 'last_name', 'email', 'phone', 
                       'shipping_address_line1', 'city', 'state', 'zip_code']
    
    for field in required_fields:
        if not data.get(field):
            errors.append(f'{field} is required')
    
    if data.get('email'):
        email = data['email']
        if '@' not in email or '.' not in email.split('@')[-1]:
            errors.append('Invalid email format')
    
    if data.get('phone'):
        phone = data['phone'].replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if not phone.isdigit() or len(phone) < 7:
            errors.append('Invalid phone number format')
    
    if data.get('zip_code'):
        import re
        if not re.match(r'^\d{5}(-\d{4})?$', data['zip_code']):
            errors.append('Invalid ZIP code format (e.g., 96740 or 96740-1234)')
    
    if not data.get('items') or len(data['items']) == 0:
        errors.append('At least one item is required')
    else:
        for i, item in enumerate(data['items']):
            if not item.get('product_name'):
                errors.append(f'Item {i+1}: product name is required')
            if not item.get('quantity') or item['quantity'] < 1:
                errors.append(f'Item {i+1}: valid quantity is required (minimum 1)')
            if not item.get('price') or item['price'] < 0:
                errors.append(f'Item {i+1}: valid price is required')
    
    return errors

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'Pulama Farm Order API',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate data
        errors = validate_order_data(data)
        if errors:
            return jsonify({
                'success': False,
                'message': 'Validation failed',
                'errors': errors
            }), 400
        
        # Calculate total amount
        total_amount = sum(item.get('quantity', 0) * item.get('price', 0) for item in data['items'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if email already exists (prevent duplicate orders)
        cursor.execute('SELECT id FROM orders WHERE email = ?', (data['email'],))
        existing_order = cursor.fetchone()
        if existing_order:
            conn.close()
            return jsonify({
                'success': False,
                'message': 'An order with this email already exists. Please contact us directly.'
            }), 409
        
        # Insert order
        cursor.execute('''
            INSERT INTO orders (first_name, last_name, email, phone, 
                              shipping_address_line1, shipping_address_line2,
                              city, state, zip_code, country, total_amount, 
                              status, special_instructions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
        ''', (
            data['first_name'],
            data['last_name'],
            data['email'],
            data['phone'],
            data['shipping_address_line1'],
            data.get('shipping_address_line2', ''),
            data['city'],
            data['state'],
            data['zip_code'],
            data.get('country', 'United States'),
            total_amount,
            data.get('special_instructions', '')
        ))
        
        order_id = cursor.lastrowid
        
        # Insert order items
        for item in data['items']:
            subtotal = item.get('quantity', 0) * item.get('price', 0)
            cursor.execute('''
                INSERT INTO order_items (order_id, product_name, quantity, price, subtotal)
                VALUES (?, ?, ?, ?, ?)
            ''', (order_id, item['product_name'], item['quantity'], item['price'], subtotal))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Order placed successfully',
            'order_id': order_id,
            'total_amount': total_amount
        }), 201
        
    except Exception as e:
        print(f'Error creating order: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Server error while processing order'
        }), 500

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get order details by ID."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get order details
        cursor.execute('SELECT * FROM orders WHERE id = ?', (order_id,))
        order = cursor.fetchone()
        
        if not order:
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Order not found'
            }), 404
        
        # Get order items
        cursor.execute('SELECT * FROM order_items WHERE order_id = ?', (order_id,))
        items = cursor.fetchall()
        
        conn.close()
        
        order_data = dict(order)
        order_data['items'] = [dict(item) for item in items]
        
        return jsonify({
            'success': True,
            'order': order_data
        }), 200
        
    except Exception as e:
        print(f'Error getting order: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Server error while retrieving order'
        }), 500

@app.route('/api/orders', methods=['GET'])
def get_all_orders():
    """Get all orders (admin endpoint)."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        status = request.args.get('status')
        email = request.args.get('email')
        
        query = 'SELECT * FROM orders'
        conditions = []
        params = []
        
        if status:
            conditions.append('status = ?')
            params.append(status)
        if email:
            conditions.append('email LIKE ?')
            params.append(f'%{email}%')
        
        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)
        
        query += ' ORDER BY created_at DESC'
        
        cursor.execute(query, params)
        orders = cursor.fetchall()
        
        conn.close()
        
        return jsonify({
            'success': True,
            'orders': [dict(order) for order in orders]
        }), 200
        
    except Exception as e:
        print(f'Error getting orders: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Server error while retrieving orders'
        }), 500

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status (admin endpoint)."""
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({
                'success': False,
                'message': 'Status is required'
            }), 400
        
        valid_statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
        if data['status'] not in valid_statuses:
            return jsonify({
                'success': False,
                'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
            }), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if order exists
        cursor.execute('SELECT id FROM orders WHERE id = ?', (order_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Order not found'
            }), 404
        
        # Update status
        cursor.execute('''
            UPDATE orders 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        ''', (data['status'], order_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': f'Order status updated to {data["status"]}'
        }), 200
        
    except Exception as e:
        print(f'Error updating order status: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Server error while updating order status'
        }), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
