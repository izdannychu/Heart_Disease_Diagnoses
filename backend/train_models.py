import os
import json
import urllib.request
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_curve, auc
import joblib

# Paths
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BACKEND_DIR, 'data')
MODELS_DIR = os.path.join(BACKEND_DIR, 'models')
CSV_PATH = os.path.join(DATA_DIR, 'heart.csv')

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# Dataset URLs (Primary and Fallback)
PRIMARY_URL = "https://raw.githubusercontent.com/xpy-10/DataSet/main/heart.csv"
FALLBACK_URL = "https://raw.githubusercontent.com/imteekay/heart-failure-prediction/main/heart.csv"

def download_dataset():
    if os.path.exists(CSV_PATH):
        print(f"Dataset already exists at {CSV_PATH}")
        return
    
    print("Downloading dataset...")
    try:
        urllib.request.urlretrieve(PRIMARY_URL, CSV_PATH)
        print("Dataset downloaded successfully from primary URL.")
    except Exception as e:
        print(f"Failed to download from primary URL: {e}. Trying fallback URL...")
        try:
            urllib.request.urlretrieve(FALLBACK_URL, CSV_PATH)
            print("Dataset downloaded successfully from fallback URL.")
        except Exception as e_fallback:
            print(f"Failed to download from fallback URL: {e_fallback}")
            # If all fails, let's raise
            raise RuntimeError("Could not download the heart failure prediction dataset.")

def train_and_evaluate():
    # 1. Read Dataset
    df = pd.read_csv(CSV_PATH)
    print(f"Dataset shape: {df.shape}")
    
    # 2. Features and Target
    # Columns: Age, Sex, ChestPainType, RestingBP, Cholesterol, FastingBS, RestingECG, MaxHR, ExerciseAngina, Oldpeak, ST_Slope, HeartDisease
    X = df.drop(columns=['HeartDisease'])
    y = df['HeartDisease']
    
    categorical_cols = ['Sex', 'ChestPainType', 'RestingECG', 'ExerciseAngina', 'ST_Slope']
    numerical_cols = ['Age', 'RestingBP', 'Cholesterol', 'MaxHR', 'Oldpeak']
    # FastingBS is already binary (0 or 1), we pass it through without scaling
    
    # 3. Train-Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # 4. Column Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols)
        ],
        remainder='passthrough' # For FastingBS
    )
    
    # Fit preprocessor and transform train/test features
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    # Save the preprocessor
    joblib.dump(preprocessor, os.path.join(MODELS_DIR, 'preprocessor.joblib'))
    print("Preprocessor saved successfully.")
    
    # Get feature names after transformation for Feature Importance analysis
    # Let's rebuild the feature name list
    cat_encoder = preprocessor.named_transformers_['cat']
    encoded_cat_names = cat_encoder.get_feature_names_out(categorical_cols).tolist()
    feature_names = numerical_cols + encoded_cat_names + ['FastingBS']
    
    # Define models
    models = {
        'Decision Tree': DecisionTreeClassifier(max_depth=5, random_state=42),
        'Naive Bayes': GaussianNB(),
        'SVM': SVC(probability=True, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    }
    
    metrics_summary = {}
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train_processed, y_train)
        
        # Predictions
        y_pred = model.predict(X_test_processed)
        y_prob = model.predict_proba(X_test_processed)[:, 1] if hasattr(model, 'predict_proba') else None
        
        # Save model
        model_filename = name.lower().replace(' ', '_') + '.joblib'
        joblib.dump(model, os.path.join(MODELS_DIR, model_filename))
        
        # Metrics
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred) # TN, FP, FN, TP
        
        # ROC curve
        fpr, tpr, _ = roc_curve(y_test, y_prob) if y_prob is not None else ([], [], [])
        roc_auc = auc(fpr, tpr) if y_prob is not None else 0.0
        
        # Confusion matrix list representation
        cm_list = cm.tolist() # [[TN, FP], [FN, TP]]
        
        metrics_summary[name] = {
            'accuracy': float(acc),
            'precision': float(prec),
            'recall': float(rec),
            'f1_score': float(f1),
            'confusion_matrix': cm_list,
            'roc_auc': float(roc_auc),
            'roc_curve': {
                'fpr': fpr.tolist(),
                'tpr': tpr.tolist()
            }
        }
        
        # Feature importance (if available)
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            # Map features to their importances and sort them
            feat_imp = sorted(zip(feature_names, importances.tolist()), key=lambda x: x[1], reverse=True)
            metrics_summary[name]['feature_importance'] = feat_imp
            
        print(f"{name} -> Accuracy: {acc:.4f}, Precision: {prec:.4f}, Recall: {rec:.4f}, F1: {f1:.4f}")
        
    # Save training metrics summary as JSON
    with open(os.path.join(MODELS_DIR, 'metrics.json'), 'w') as f:
        json.dump(metrics_summary, f, indent=4)
    print("Metrics summary saved successfully.")
    
    # Save descriptive dataset statistics for the EDA panel
    # We will compute statistics on the original dataset
    stats = {
        'total_records': int(len(df)),
        'heart_disease_distribution': df['HeartDisease'].value_counts().to_dict(),
        'gender_distribution': df['Sex'].value_counts().to_dict(),
        'heart_disease_by_gender': df.groupby('Sex')['HeartDisease'].mean().to_dict(),
        'age_stats': df['Age'].describe().to_dict(),
        'cholesterol_stats': df['Cholesterol'].describe().to_dict(),
        'resting_bp_stats': df['RestingBP'].describe().to_dict(),
        'max_hr_stats': df['MaxHR'].describe().to_dict(),
        'chest_pain_distribution': df['ChestPainType'].value_counts().to_dict(),
        'heart_disease_by_chest_pain': df.groupby('ChestPainType')['HeartDisease'].mean().to_dict(),
        'st_slope_distribution': df['ST_Slope'].value_counts().to_dict(),
        'heart_disease_by_st_slope': df.groupby('ST_Slope')['HeartDisease'].mean().to_dict(),
        # Correlation matrix for numerical fields
        'correlation_matrix': df[numerical_cols + ['FastingBS', 'HeartDisease']].corr().to_dict()
    }
    
    with open(os.path.join(MODELS_DIR, 'stats.json'), 'w') as f:
        json.dump(stats, f, indent=4)
    print("Dataset stats saved successfully.")

if __name__ == '__main__':
    download_dataset()
    train_and_evaluate()
