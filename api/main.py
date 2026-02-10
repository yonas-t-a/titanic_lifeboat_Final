from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os
import numpy as np

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.get("/api/healthchecker")
def healthchecker():
    return {"status": "success"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_models():
    m_path = os.path.join(BASE_DIR, "models")
    model_files = {
        "Logistic Gate": "logistic_gate.pkl",
        "Random Forest": "random_forest_gate.pkl",
        "SVM Gate": "svm_gate.pkl",
        "XGBoost Gate": "xgboost_gate.pkl"
    }
    
    loaded = {}
    for label, filename in model_files.items():
        full_path = os.path.join(m_path, filename)
        if os.path.exists(full_path):
            try:
                loaded[label] = joblib.load(full_path)
            except Exception as e:
                print(f"⚠️ Error loading {label}: {e}")
    return loaded

models = load_models()

# --- 2. THE API ENDPOINT ---
@app.post("/api/predict")
async def predict(data: dict = Body(...)):
    try:
        # We use a simple list/numpy array instead of a heavy DataFrame
        # Order: [Pclass, Age, SibSp, Parch, Fare, Sex_male, Embarked_Q, Embarked_S]
        input_data = [
            int(data.get('pclass', 3)),
            float(data.get('age', 25)),
            0, # SibSp
            0, # Parch
            float(data.get('fare', 32.0)),
            int(data.get('sex_male', 1)),
            0, # Embarked_Q
            1  # Embarked_S
        ]
        
        # Convert to 2D array for the models
        input_array = np.array([input_data])

        gate_results = []
        for name, model in models.items():
            # Most models accept numpy arrays directly
            if name == "SVM Gate" and not hasattr(model, "predict_proba"):
                decision = model.decision_function(input_array)[0]
                prob = 1 / (1 + np.exp(-decision))
            else:
                prob_array = model.predict_proba(input_array)
                prob = prob_array[0][1]
            
            gate_results.append({
                "name": name,
                "prob": round(float(prob) * 100, 1),
                "survived": bool(prob > 0.5)
            })

        return {"results": gate_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}