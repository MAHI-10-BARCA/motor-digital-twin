Motor Digital Twin – Real-Time Edge Simulation & ML Fault Detection

A fully functional Digital Twin System for industrial motors, integrating:

✔ Real-time motor simulation

✔ Machine learning fault classification (XGBoost)

✔ Health score calculation

✔ Edge-based AI recommendation engine

✔ Live updating dashboard with charts

✔ Trend analysis

✔ Fault probability output

📌 Features

Digital Twin simulation of:

Temperature

Vibration

Current

Speed (RPM)

Multi-class fault detection

AI-driven advisory system

Real-time plotting using Chart.js

Background thread for live updates

Clean dark UI dashboard

API endpoint for data retrieval

🚀 Project Structure
motor-digital-twin/
│
├── dashboard.py            # Flask backend + API + thread
├── edge_processor.py        # Digital Twin logic + ML + AI engine
├── requirements.txt
├── README.md
│
├── models/
│   └── xgb_fault_model.pkl  # ML model
│
├── templates/
│   └── index.html           # Dashboard UI
│
└── static/
    └── app.js               # Frontend logic



▶️ Run the Dashboard
python dashboard.py


Open in browser:

http://127.0.0.1:5000/

📊 Dashboard Overview

Live temperature, vibration, current, speed

Real-time fault class

Health score

Trend charts

AI recommendation panel

Smooth UI with auto updates every second

🧠 AI & ML Details

XGBoost multi-class model

Predicts:

Normal

Bearing Fault

Rotor Fault

Stator Fault

Imbalance

AI maintenance advice engine

Trend-sensitive detection for safety