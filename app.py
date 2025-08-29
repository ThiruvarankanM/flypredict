from flask import Flask, render_template, request, jsonify
import pandas as pd
import logging
from datetime import datetime
import requests
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'flight_price_predictor_2025'

# Hugging Face Space API URL
HF_SPACE_URL = os.environ.get("HF_SPACE_URL", "https://huggingface.co/spaces/Thiruvarankan/flypredict-model-space/api/predict/")

def call_remote_inference(data):
    """Call Hugging Face Space for prediction"""
    try:
        resp = requests.post(HF_SPACE_URL, json=data, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Remote inference failed: {str(e)}")
        return {"error": str(e)}

# Feature mappings
AIRLINE_MAPPING = {
    'IndiGo': 'airline_Indigo',
    'Air India': 'airline_Air_India', 
    'SpiceJet': 'airline_SpiceJet',
    'Vistara': 'airline_Vistara',
    'GO FIRST': 'airline_GO_FIRST',
    'AirAsia': 'airline_AirAsia'
}

CITY_MAPPING = {
    'Delhi': 'Delhi',
    'Mumbai': 'Mumbai', 
    'Bangalore': 'Bangalore',
    'Chennai': 'Chennai',
    'Kolkata': 'Kolkata',
    'Hyderabad': 'Hyderabad'
}

TIME_MAPPING = {
    'Early_Morning': 'Early_Morning',
    'Morning': 'Morning',
    'Afternoon': 'Afternoon', 
    'Evening': 'Evening',
    'Night': 'Night',
    'Late_Night': 'Late_Night'
}

# Input validation
def validate_input_data(data):
    errors = []
    if not (1 <= int(data.get('days_left', 0)) <= 365):
        errors.append("Days before flight must be 1-365")
    if not (30 <= float(data.get('duration', 0)) <= 1000):
        errors.append("Flight duration must be 30-1000 minutes")
    if int(data.get('stops', -1)) not in [0, 1, 2, 3]:
        errors.append("Invalid number of stops")
    if data.get('airline') not in AIRLINE_MAPPING:
        errors.append("Invalid airline")
    if data.get('source') not in CITY_MAPPING:
        errors.append("Invalid source city")
    if data.get('dest') not in CITY_MAPPING:
        errors.append("Invalid destination city")
    if data.get('departure') not in TIME_MAPPING:
        errors.append("Invalid departure time")
    if data.get('arrival') not in TIME_MAPPING:
        errors.append("Invalid arrival time")
    if data.get('class') not in ['Economy', 'Business']:
        errors.append("Invalid class selection")
    if data.get('source') == data.get('dest'):
        errors.append("Source and destination cannot be same")
    return errors

# Insights based on prediction
def get_price_insights(price, data):
    insights = []
    if price < 3000: insights.append("💰 Great deal! Below average price.")
    elif price > 10000: insights.append("💸 Premium pricing - book in advance.")
    else: insights.append("💼 Price within normal range.")

    days_left = int(data.get('days_left', 0))
    if days_left < 7: insights.append("⚡ Last-minute booking.")
    elif days_left > 30: insights.append("📅 Early booking advantage!")

    if data.get('class') == 'Business': insights.append("✈️ Business class selected.")

    popular_routes = [('Delhi','Mumbai'),('Mumbai','Delhi'),('Bangalore','Delhi')]
    route = (data.get('source'), data.get('dest'))
    if route in popular_routes: insights.append("🔥 Popular route - many options.")

    return insights

# Home route
@app.route("/")
def home():
    return render_template("index.html", form_data={})

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    form_data = {k: request.form.get(k) for k in ['stops','days_left','duration','class','airline','source','dest','departure','arrival']}
    missing_fields = [k for k,v in form_data.items() if not v]
    if missing_fields:
        return render_template("index.html", error="Please fill all fields.", form_data=form_data)

    try:
        form_data['stops'] = int(form_data['stops'])
        form_data['days_left'] = int(form_data['days_left'])
        form_data['duration'] = float(form_data['duration'])
    except ValueError:
        return render_template("index.html", error="Invalid numeric values.", form_data=form_data)

    errors = validate_input_data(form_data)
    if errors:
        return render_template("index.html", error="; ".join(errors), form_data=form_data)

    # Call Hugging Face API
    resp = call_remote_inference(form_data)
    if "error" in resp:
        return render_template("index.html", error=resp["error"], form_data=form_data)

    final_price = resp.get("predicted_price", 0)
    insights = get_price_insights(final_price, form_data)
    return render_template("index.html", prediction=f"₹{final_price:,}", insights=" | ".join(insights), form_data=form_data)

# API endpoint
@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    errors = validate_input_data(data)
    if errors:
        return jsonify({"error": errors}), 400

    resp = call_remote_inference(data)
    if "error" in resp:
        return jsonify({"error": resp["error"]}), 500

    final_price = resp.get("predicted_price", 0)
    insights = get_price_insights(final_price, data)
    return jsonify({
        "predicted_price": final_price,
        "formatted_price": f"₹{final_price:,}",
        "insights": insights,
        "status":"success"
    })

# Health check
@app.route("/health")
def health_check():
    return jsonify({
        "status":"healthy",
        "model_status":"remote",
        "timestamp":datetime.now().isoformat()
    })

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template("index.html", error="Page not found", form_data={}), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template("index.html", error="Internal server error", form_data={}), 500

# Run app
if __name__ == "__main__":
    print("\n" + "="*60)
    print("🛫 FLIGHT PRICE PREDICTOR - STARTING UP")
    print("="*60)
    print(f"🌐 Server running on http://0.0.0.0:5000")
    print(f"🔗 Hugging Face Space URL: {HF_SPACE_URL}")
    print("="*60)
    app.run(debug=True, host='0.0.0.0', port=5000)
