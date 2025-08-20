# FlyPredict 🚀

**FlyPredict** is a machine learning application that predicts flight prices based on airline, route, travel dates, and number of stops. Built with a **Random Forest model** and a **Flask backend**, it provides instant price estimates through a user-friendly web interface, helping travelers plan trips efficiently and make informed decisions.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Dataset](#dataset)
- [Installation](#installation)
- [Docker Deployment](#docker-deployment)
- [Usage](#usage)
- [Model Training](#model-training)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- Predicts flight prices based on multiple factors:
  - Airline
  - Source and destination cities
  - Travel date and number of days left
  - Number of stops
  - Flight duration
- Displays results instantly on a web interface
- Feature importance visualization for better understanding
- Tuned **Random Forest model** for high prediction accuracy

---

## Technologies Used
- **Python** – ML model development
- **Flask** – Backend API
- **Pandas / NumPy** – Data preprocessing
- **Scikit-learn** – Machine learning and evaluation
- **Matplotlib / Seaborn** – Data visualization
- **HTML, CSS, JavaScript** – Frontend interface
- **Pickle** – Model serialization
- **Docker** – Containerized deployment

---

## Dataset
- The model is trained on a cleaned flight dataset containing:
  - Airline
  - Source and destination cities
  - Departure and arrival times
  - Duration
  - Stops
  - Days left to travel
  - Price (target variable)

> Dataset file: `Clean_Dataset.csv`

---

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/flypredict.git
cd flypredict
````

2. **Create and activate a virtual environment**

```bash
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Download the trained model (\~1.2GB) from Hugging Face**

```bash
wget https://huggingface.co/Thiruvarankan/flypredict-model/resolve/main/model.pkl
```

5. **Run the Flask app**

```bash
python app.py
```

6. Open your browser at:

```
http://127.0.0.1:5000/
```

---

## Docker Deployment

* A `Dockerfile` is included for containerized deployment.
* **Important:** The `model.pkl` (\~1.2GB) is **not included** in the repo. Download it from Hugging Face first:

```bash
wget https://huggingface.co/Thiruvarankan/flypredict-model/resolve/main/model.pkl
```

* Build the Docker image:

```bash
docker build -t flypredict-app .
```

* Run the container:

```bash
docker run -p 5000:5000 flypredict-app
```

* Open your browser at: `http://127.0.0.1:5000/` to use the app.

---

## Usage

1. Enter flight details in the form (stops, airline, source/destination, travel dates, etc.).
2. Click **Predict**.
3. The predicted flight price will be displayed instantly.

> Example of a new sample input:

```python
{
  'stops': 1,
  'days_left': 5,
  'duration': 120,
  'airline_IndiGo': 1,
  'source_Delhi': 1,
  'dest_Mumbai': 1,
  ...
}
```

---

## Model Training

* Preprocessing:

  * Remove missing values
  * Encode categorical features (airline, cities, times)
  * Convert boolean columns to numeric
* Models trained and evaluated:

  * Linear Regression
  * K-Nearest Neighbors
  * Random Forest (best model)
* Hyperparameter tuning using:

  * **Grid Search**
  * **Randomized Search**
* Final model saved as: `model.pkl` (\~1.2GB)

  * Available for download: [Hugging Face link](https://huggingface.co/Thiruvarankan/flypredict-model/resolve/main/model.pkl)

---

## Screenshots

*(Add screenshots of your web app here)*
![Home Page](screenshots/home.png)
![Prediction Result](screenshots/result.png)

---

## Future Improvements

* Add more ML models (XGBoost, Gradient Boosting)
* Integrate dynamic date picker and multi-city options
* Deploy as a cloud app (Heroku, Render)
* Improve feature engineering (seasonal trends, holidays)
* Add user authentication and save prediction history

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes and commit (`git commit -m "Description"`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

