import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier

np.random.seed(42)

# ========== Synthetic Data ==========
N = 6000

temp = np.random.normal(70, 12, N)
vib = np.random.normal(3, 1.5, N)
current = np.random.normal(10, 3, N)
speed = np.random.normal(1450, 80, N)

X = np.column_stack([temp, vib, current, speed])

# ---------- Binary labels ----------
y_binary = (
    (temp > 90) |
    (vib > 6) |
    (current > 16)
).astype(int)

# ---------- Multi-class labels ----------
y_multi = np.zeros(N, dtype=int)
y_multi[(vib > 6)] = 1
y_multi[(current > 16)] = 2
y_multi[(temp > 95)] = 3
y_multi[(speed > 1500)] = 4

# ---------- Scale for XGBoost ----------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ========== Train baseline RF ==========
print("Training baseline RandomForest...")
rf = RandomForestClassifier(n_estimators=200, max_depth=10)
rf.fit(X, y_binary)

# ========== Train XGBoost multi-class ==========
print("Training XGBoost multi-class...")
xgb = XGBClassifier(
    n_estimators=250,
    max_depth=6,
    learning_rate=0.1,
    objective="multi:softprob",
    num_class=5,
)
xgb.fit(X_scaled, y_multi)

# ========== Save ==========
os.makedirs("models", exist_ok=True)

joblib.dump(rf, "models/baseline_model.pkl")
joblib.dump((scaler, xgb), "models/xgb_fault_model.pkl")

print("\nDone! Saved:")
print("models/baseline_model.pkl")
print("models/xgb_fault_model.pkl")
