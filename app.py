from flask import Flask, request, jsonify, render_template
import sqlite3
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Database setup
def init_db():
    """Initialize the database with tables if they don't exist."""
    conn = sqlite3.connect('bikerental.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS bikes (id TEXT PRIMARY KEY, model TEXT)''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, name TEXT, contact TEXT)''')
    conn.commit()
    conn.close()

init_db()

# Function to get a database connection
def get_db_connection():
    """Establish a connection to the database."""
    conn = sqlite3.connect('bikerental.db')
    conn.row_factory = sqlite3.Row  # This makes results accessible by column name
    return conn

# Routes for Bikes
@app.route('/api/bikes', methods=['POST'])
def add_bike():
    """Handle adding a bike to the database."""
    try:
        data = request.get_json()  # Get data from request
        if not data or 'id' not in data or 'model' not in data:
            return jsonify({'error': 'Invalid input, missing bike id or model'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO bikes (id, model) VALUES (?, ?)", (data['id'], data['model']))
        conn.commit()
        conn.close()

        return jsonify(data), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Bike ID already exists'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bikes', methods=['GET'])
def get_bikes():
    """Fetch all bikes from the database."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bikes")
        bikes = cursor.fetchall()
        conn.close()
        return jsonify([{'id': bike['id'], 'model': bike['model']} for bike in bikes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Routes for Customers
@app.route('/api/customers', methods=['POST'])
def add_customer():
    """Handle adding a customer to the database."""
    try:
        data = request.get_json()  # Get data from request
        if not data or 'id' not in data or 'name' not in data or 'contact' not in data:
            return jsonify({'error': 'Invalid input, missing customer id, name or contact'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO customers (id, name, contact) VALUES (?, ?, ?)", 
                       (data['id'], data['name'], data['contact']))
        conn.commit()
        conn.close()

        return jsonify(data), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Customer ID already exists'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Fetch all customers from the database."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM customers")
        customers = cursor.fetchall()
        conn.close()
        return jsonify([{'id': customer['id'], 'name': customer['name'], 'contact': customer['contact']} for customer in customers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Home route to serve HTML
@app.route('/')
def index():
    """Render the homepage."""
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
