import pickle
import os

# Load the model
model_path = "model.pkl"
if not os.path.exists(model_path):
    print("❌ Model file not found!")
    exit()

with open(model_path, "rb") as f:
    model = pickle.load(f)
    print("✅ Model loaded successfully!")

# Print the model's expected feature names
try:
    feature_names = model.feature_names_in_
    print("\n📋 Features expected by the model:")
    for i, f in enumerate(feature_names):
        print(f"{i+1}. {f}")
    print(f"\nTotal features: {len(feature_names)}")
except AttributeError:
    print("⚠️ This model does not have `feature_names_in_`. Make sure it's a scikit-learn model fitted with named features.")
