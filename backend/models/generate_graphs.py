import os
import sys
import json
from pathlib import Path
import joblib
import numpy as np
import pandas as pd

# Target directory for saving plots
PROJECT_ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_DIR = PROJECT_ROOT / "docs" / "images"

# Try to import matplotlib and seaborn, install if missing
try:
    import matplotlib
    matplotlib.use('Agg') # Non-interactive backend
    import matplotlib.pyplot as plt
    import seaborn as sns
except ImportError:
    print("Installing matplotlib and seaborn packages...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "matplotlib", "seaborn"])
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import seaborn as sns

from sklearn.metrics import roc_curve, auc, confusion_matrix
from sklearn.model_selection import train_test_split

# Import training pipeline functions
sys.path.append(str(Path(__file__).resolve().parents[1]))
from models.train_models import load_diabetes_training_data, clean_kaggle_diabetes, clean_pima, build_preprocessor

def main():
    print("Loading model pipeline and dataset...")
    # Load pipeline
    model_path = Path(__file__).resolve().parent / "diabetes_xgb_pipeline.pkl"
    if not model_path.exists():
        print(f"Error: Trained model not found at {model_path}")
        return
    
    artifact = joblib.load(model_path)
    pipeline = artifact["model"]
    features = artifact["features"]
    
    # Load and clean training data
    df, _, target, _ = load_diabetes_training_data()
    
    # Recreate split
    x_train, x_test, y_train, y_test = train_test_split(
        df[features],
        df[target],
        test_size=0.25,
        random_state=161,
        stratify=df[target],
    )
    
    y_pred = pipeline.predict(x_test)
    y_score = pipeline.predict_proba(x_test)[:, 1]
    
    # Ensure artifact dir exists
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    
    sns.set_theme(style="darkgrid")
    
    # 1. Plot Confusion Matrix
    print("Generating Confusion Matrix plot...")
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", cbar=False,
                xticklabels=["No Diabetes", "Diabetes"],
                yticklabels=["No Diabetes", "Diabetes"],
                annot_kws={"size": 14, "weight": "bold"})
    plt.title("Confusion Matrix (XGBoost Classifier)", fontsize=16, pad=15)
    plt.ylabel("Actual Label", fontsize=12)
    plt.xlabel("Predicted Label", fontsize=12)
    plt.tight_layout()
    cm_path = ARTIFACT_DIR / "confusion_matrix.png"
    plt.savefig(cm_path, dpi=300)
    plt.close()
    print(f"Saved Confusion Matrix to {cm_path}")
    
    # 2. Plot ROC Curve
    print("Generating ROC Curve plot...")
    fpr, tpr, _ = roc_curve(y_test, y_score)
    roc_auc = auc(fpr, tpr)
    
    plt.figure(figsize=(7, 6))
    plt.plot(fpr, tpr, color='darkorange', lw=2.5, label=f'ROC Curve (AUC = {roc_auc:.4f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=1.5, linestyle='--')
    plt.xlim([-0.02, 1.02])
    plt.ylim([-0.02, 1.02])
    plt.xlabel('False Positive Rate (1 - Specificity)', fontsize=12)
    plt.ylabel('True Positive Rate (Sensitivity)', fontsize=12)
    plt.title('Receiver Operating Characteristic (ROC) Curve', fontsize=16, pad=15)
    plt.legend(loc="lower right", fontsize=12)
    plt.tight_layout()
    roc_path = ARTIFACT_DIR / "roc_curve.png"
    plt.savefig(roc_path, dpi=300)
    plt.close()
    print(f"Saved ROC Curve to {roc_path}")
    
    # 3. Plot Feature Importance
    print("Generating Feature Importance plot...")
    # Get model object from pipeline step
    model = pipeline.named_steps["model"]
    preprocessor = pipeline.named_steps["preprocess"]
    
    # Retrieve feature names after preprocessing
    if hasattr(preprocessor, "get_feature_names_out"):
        feature_names = preprocessor.get_feature_names_out()
    else:
        # Fallback if StandardScaler is used directly
        feature_names = features
        
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1]
        
        # Take top 10 features if many
        top_indices = indices[:10]
        top_importances = importances[top_indices]
        top_names = [feature_names[i] for i in top_indices]
        
        plt.figure(figsize=(8, 6))
        sns.barplot(x=top_importances, y=top_names, palette="viridis")
        plt.title("XGBoost Model - Feature Importance (Top Features)", fontsize=16, pad=15)
        plt.xlabel("Relative Importance Score", fontsize=12)
        plt.ylabel("Clinical Feature / Laboratory Vital", fontsize=12)
        plt.tight_layout()
        fi_path = ARTIFACT_DIR / "feature_importance.png"
        plt.savefig(fi_path, dpi=300)
        plt.close()
        print(f"Saved Feature Importance to {fi_path}")
    else:
        print("Model does not support feature importances attribute.")

if __name__ == "__main__":
    main()
