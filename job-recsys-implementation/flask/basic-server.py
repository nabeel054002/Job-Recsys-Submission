from flask import Flask, jsonify, request
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define a route for the root URL that returns a simple message
@app.route('/', methods=['GET'])
def home():
    return "Welcome to the basic Flask server!"

# Define a sample route that returns a JSON response
@app.route('/api/data', methods=['GET'])
def get_data():
    sample_data = {
        'id': 1,
        'name': 'Sample Item',
        'description': 'This is a sample item from the server.'
    }
    return jsonify(sample_data)

# Define a route to receive data with POST
@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.get_json()  # Parse incoming JSON
    if not data:
        return jsonify({"error": "No data provided"}), 400
    return jsonify({"message": "Data received", "data": data}), 200

# Run the server
app.run(debug=True, port=5000)
