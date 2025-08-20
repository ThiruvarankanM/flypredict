from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
import logging
from datetime import datetime
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'flight_price_predictor_2025'

# Load the model
try:
    model_path = "model.pkl"
    if os.path.exists(model_path):
        model = pickle.load(open(model_path, "rb"))
        logger.info("✅ Model loaded successfully!")
    else:
        logger.error("❌ Model file not found!")
        model = None
except Exception as e:
    logger.error(f"❌ Error loading model: {str(e)}")
    model = None

# Feature columns matching your training DataFrame
COLUMNS = [
    'stops', 'days_left', 'duration', 'class',
    'airline_Air_India', 'airline_AirAsia', 'airline_GO_FIRST',
    'airline_Indigo', 'airline_SpiceJet', 'airline_Vistara',
    'source_Bangalore', 'source_Chennai', 'source_Delhi',
    'source_Hyderabad', 'source_Kolkata', 'source_Mumbai',
    'dest_Bangalore', 'dest_Chennai', 'dest_Delhi',
    'dest_Hyderabad', 'dest_Kolkata', 'dest_Mumbai',
    'arrival_Early_Morning', 'arrival_Morning', 'arrival_Afternoon',
    'arrival_Evening', 'arrival_Night', 'arrival_Late_Night',
    'departure_Early_Morning', 'departure_Morning', 'departure_Afternoon',
    'departure_Evening', 'departure_Night', 'departure_Late_Night'
]

# Airline, city, time mappings
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

# Create input DataFrame for prediction
def create_prediction_dataframe(data):
    df = pd.DataFrame([{col: 0 for col in COLUMNS}])
    df.loc[0, 'stops'] = int(data['stops'])
    df.loc[0, 'days_left'] = int(data['days_left'])
    df.loc[0, 'duration'] = float(data['duration'])
    df.loc[0, 'class'] = 1 if data['class'] == 'Business' else 0

    airline_col = AIRLINE_MAPPING.get(data['airline'])
    if airline_col in COLUMNS:
        df.loc[0, airline_col] = 1

    source_col = f"source_{CITY_MAPPING.get(data['source'])}"
    dest_col = f"dest_{CITY_MAPPING.get(data['dest'])}"
    if source_col in COLUMNS: df.loc[0, source_col] = 1
    if dest_col in COLUMNS: df.loc[0, dest_col] = 1

    departure_col = f"departure_{TIME_MAPPING.get(data['departure'])}"
    arrival_col = f"arrival_{TIME_MAPPING.get(data['arrival'])}"
    if departure_col in COLUMNS: df.loc[0, departure_col] = 1
    if arrival_col in COLUMNS: df.loc[0, arrival_col] = 1

    logger.info(f"Created prediction DataFrame with shape: {df.shape}")

    # Reorder columns to match model
    if model:
        df = df[model.feature_names_in_]
    return df

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
    if model is None:
        return render_template("index.html", error="Model not available.", form_data={})

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

    prediction_df = create_prediction_dataframe(form_data)
    try:
        price_prediction = model.predict(prediction_df)[0]
        final_price = max(1000, round(price_prediction))
        insights = get_price_insights(final_price, form_data)
        return render_template("index.html", prediction=f"₹{final_price:,}", insights=" | ".join(insights), form_data=form_data)
    except Exception as e:
        logger.error(f"Model prediction error: {str(e)}")
        return render_template("index.html", error="Prediction failed.", form_data=form_data)

# API endpoint
@app.route("/api/predict", methods=["POST"])
def api_predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    errors = validate_input_data(data)
    if errors:
        return jsonify({"error": errors}), 400
    prediction_df = create_prediction_dataframe(data)
    try:
        price = model.predict(prediction_df)[0]
        final_price = max(1000, round(price))
        insights = get_price_insights(final_price, data)
        return jsonify({"predicted_price": final_price, "formatted_price": f"₹{final_price:,}", "insights": insights, "status":"success"})
    except Exception as e:
        logger.error(f"API prediction error: {str(e)}")
        return jsonify({"error": "Prediction failed"}), 500

# Health check
@app.route("/health")
def health_check():
    return jsonify({"status":"healthy","model_status":"loaded" if model else "not loaded","timestamp":datetime.now().isoformat(),"columns_count":len(COLUMNS)})

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
    print(f"📊 Model Status: {'✅ Loaded' if model else '❌ Not Loaded'}")
    print(f"🔧 Features Count: {len(COLUMNS)}")
    print(f"🎯 Supported Airlines: {', '.join(AIRLINE_MAPPING.keys())}")
    print(f"🏙️ Supported Cities: {', '.join(CITY_MAPPING.keys())}")
    print("🌐 Server running on http://127.0.0.1:5000")
    print("="*60)
    app.run(debug=True, host='127.0.0.1', port=5000)
