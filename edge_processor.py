# edge_processor.py

import time
import random
from collections import deque
import numpy as np
import joblib

class EdgeProcessor:
    def __init__(self):
        # Load XGBoost multi-class fault model
        try:
            self.scaler, self.fault_model = joblib.load("models/xgb_fault_model.pkl")
            self.fault_classes = ["Normal", "Bearing Fault", "Rotor Fault", "Stator Fault", "Imbalance"]
        except:
            self.scaler = None
            self.fault_model = None
            self.fault_classes = ["Normal"]

        self.latest = None
        self.history = deque(maxlen=120)

    # -------- SIMULATION --------
    def simulate(self):
        temp = random.uniform(50, 90)
        vib  = random.uniform(1, 7)
        curr = random.uniform(5, 20)
        speed = random.uniform(1200, 1600)
        return temp, vib, curr, speed

    # -------- AI ADVICE ENGINE --------
    def get_ai_advice(self, temp, vib, curr, speed, health, fault):

        # PRIORITY FAULT RULES
        if fault == "Bearing Fault" and vib > 5:
            return "Bearing wear detected. Schedule lubrication."

        if fault == "Rotor Fault" and speed < 1300:
            return "Rotor imbalance suspected. Reduce load."

        if fault == "Stator Fault" and temp > 85:
            return "Stator overheating. Inspect cooling system."

        # MEDIUM LEVEL RULES
        if vib > 4:
            return "Vibration rising. Inspect alignment."

        if temp > 75:
            return "Motor running hot. Improve ventilation."

        if curr > 15:
            return "High current draw. Possible overload."

        if speed < 1350:
            return "RPM slightly low. Monitor load."

        # HEALTH BASED
        if health < 70:
            return "Motor health declining. Monitor closely."
        if health < 50:
            return "Motor under stress. Avoid overload."
        if health < 30:
            return "Critical condition. Maintenance required."

        return "System stable."

    # -------- PREDICTION --------
    def predict(self):
        temp, vib, curr, speed = self.simulate()
        X = np.array([[temp, vib, curr, speed]])

        # Fault classification
        if self.fault_model:
            X_scaled = self.scaler.transform(X)
            proba = self.fault_model.predict_proba(X_scaled)[0]
            idx = int(np.argmax(proba))
            fault = self.fault_classes[idx]
        else:
            proba = [1.0]
            fault = "Normal"

        # Health Score 0-100
        health = 100
        health -= max(0, temp - 80) * 1.2
        health -= max(0, vib - 5) * 4
        health -= max(0, curr - 15) * 2
        health -= max(0, speed - 1500) * 0.02
        health = max(0, min(100, health))

        advice = self.get_ai_advice(temp, vib, curr, speed, health, fault)

        point = {
            "timestamp": time.time(),
            "temp": temp,
            "vibration": vib,
            "current": curr,
            "speed": speed,
            "health": health,
            "fault_class": fault,
            "fault_proba": [float(x) for x in proba],
            "advice": advice
        }

        self.latest = point
        self.history.append(point)
        return point

    def get_latest(self):
        return self.latest

    def get_history(self):
        return list(self.history)
