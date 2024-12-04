from flask import Flask, request, jsonify, render_template
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow CORS for API routes

# Database Setup and Utility Functions
DB_FILE = 'bikerental.db'

def init_db():
    """Initialize the database with required tables."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS bikes (
            id TEXT PRIMARY KEY, 
            model TEXT NOT NULL
        )''')
        cursor.execute('''CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY, 
            name TEXT NOT NULL, 
            contact TEXT NOT NULL
        )''')
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT UNIQUE NOT NULL, 
            password TEXT NOT NULL
        )''')
        print("Database initialized successfully.")

def get_db_connection():
    """Get a connection to the database."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize the database
init_db()

# Routes for Bikes
@app.route('/api/bikes', methods=['POST'])
def add_bike():
    """Add a bike to the database."""
    data = request.get_json()
    if not data or 'id' not in data or 'model' not in data:
        return jsonify({'error': 'Invalid input. Provide bike ID and model.'}), 400

    try:
        with get_db_connection() as conn:
            conn.execute("INSERT INTO bikes (id, model) VALUES (?, ?)", (data['id'], data['model']))
        return jsonify({'message': 'Bike added successfully.', 'bike': data}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Bike ID already exists.'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'}), 500

@app.route('/api/bikes', methods=['GET'])
def get_bikes():
    """Fetch all bikes from the database."""
    try:
        with get_db_connection() as conn:
            bikes = conn.execute("SELECT * FROM bikes").fetchall()
        return jsonify([{'id': bike['id'], 'model': bike['model']} for bike in bikes]), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'}), 500

# Routes for Customers
@app.route('/api/customers', methods=['POST'])
def add_customer():
    """Add a customer to the database."""
    data = request.get_json()
    if not data or 'id' not in data or 'name' not in data or 'contact' not in data:
        return jsonify({'error': 'Invalid input. Provide customer ID, name, and contact.'}), 400

    try:
        with get_db_connection() as conn:
            conn.execute("INSERT INTO customers (id, name, contact) VALUES (?, ?, ?)", 
                         (data['id'], data['name'], data['contact']))
        return jsonify({'message': 'Customer added successfully.', 'customer': data}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Customer ID already exists.'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'}), 500

@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Fetch all customers from the database."""
    try:
        with get_db_connection() as conn:
            customers = conn.execute("SELECT * FROM customers").fetchall()
        return jsonify([{'id': customer['id'], 'name': customer['name'], 'contact': customer['contact']} for customer in customers]), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'}), 500

# Home Route
@app.route('/')
def index():
    """Render the homepage."""
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
