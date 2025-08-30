## FlyPredict

A machine learning application that predicts flight prices using Random Forest algorithm. Built with Flask backend and web interface for instant price estimates.

## Demo

[![Demo Video](https://img.youtube.com/vi/U_WTWLfiYoo/0.jpg)](https://youtu.be/U_WTWLfiYoo)

**[Watch Live Demo](https://youtu.be/U_WTWLfiYoo)**

## Features

- Predicts flight prices based on airline, route, travel dates, and stops
- Real-time predictions through web interface
- Random Forest model with hyperparameter tuning
- High accuracy price estimation

## Tech Stack

- **Backend:** Python, Flask, Scikit-learn
- **Data Processing:** Pandas, NumPy
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Docker

## Quick Start

### Setup

1. **Download the trained model**
   ```bash
   wget https://huggingface.co/Thiruvarankan/flypredict-model/resolve/main/model.pkl
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run application**
   ```bash
   python app.py
   ```

4. **Access at:** `http://127.0.0.1:5000/`

## Docker Deployment

```bash
# Download model
wget https://huggingface.co/Thiruvarankan/flypredict-model/resolve/main/model.pkl

# Build and run
docker build -t flypredict-app .
docker run -p 5000:5000 flypredict-app
```

## Usage

Enter flight details in the web form and click predict to get instant price estimates.

## Model Details

- **Algorithm:** Random Forest
- **Training:** Grid Search optimization
- **Model Size:** 1.2GB
- **Download:** [Hugging Face Repository](https://huggingface.co/Thiruvarankan/flypredict-model/resolve/main/model.pkl)

## License

MIT License
