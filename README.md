# AlgoSuggest 🚀

**Algorithm Recommendation System Based on Dataset**

---

## 📌 Overview

AlgoSuggest is a full stack machine learning system that automatically analyzes a dataset and recommends the best performing algorithm along with optimized hyperparameters.

Instead of manually selecting models, the system intelligently:

* detects the problem type
* trains multiple models
* tunes them using GridSearchCV
* compares performance
* returns the best algorithm

---

## 🎯 Objective

To eliminate the need for manual model selection by building an intelligent system that can:

* understand dataset structure
* identify the target variable
* determine problem type
* recommend the most suitable machine learning algorithm

---

## 🧠 Key Features

### ✅ Automatic Model Selection

No need to manually choose algorithms.

### ✅ Dynamic Target Column Selection

* User can select target column
* System can auto detect using heuristics

### ✅ Hyperparameter Tuning

Uses GridSearchCV to:

* try multiple parameter combinations
* select optimal configuration

### ✅ Supports Both Problem Types

* Classification
* Regression

### ✅ Robust Error Handling

Handles:

* missing values
* invalid data
* small datasets
* no variation cases

### ✅ Scalable Design

Works across different datasets without hardcoding.

---

## 🏗️ System Architecture

### 🔹 1. Frontend (React)

Handles user interaction.

**Flow:**

1. Upload CSV file
2. Extract column names
3. Select target column (optional)
4. Send data to backend

---

### 🔹 2. Backend (FastAPI)

**Endpoint:**
POST /train

**Responsibilities:**

* receives dataset and target
* processes input
* calls ML pipeline
* returns results

---

### 🔹 3. ML Pipeline (Core Engine)

This is the brain of the system.

---

## ⚙️ Pipeline Workflow

### 1. Dataset Loading

* Reads CSV using pandas
* Ensures minimum data size

---

### 2. Data Cleaning

* Handles missing values
* Removes invalid entries
* Converts data to numeric

---

### 3. Target Column Selection

Priority:

1. User selected column
2. Keyword detection (target, label, class, price)
3. Fallback to last column

---

### 4. Feature and Target Split

* X → features
* y → target

---

### 5. Problem Type Detection

* Regression → numeric target with many unique values
* Classification → categorical or limited unique values

---

### 6. Target Processing

* Classification → Label Encoding
* Regression → Numeric conversion

---

### 7. Model Training (GridSearchCV) ⭐

Trains multiple models with hyperparameter tuning.

#### Regression Models:

* Linear Regression
* Ridge Regression
* Random Forest Regressor

#### Classification Models:

* Logistic Regression
* Decision Tree
* Random Forest

GridSearchCV:

* tests multiple parameter combinations
* uses cross validation
* selects best model

---

### 8. Model Evaluation

* Regression → R² score
* Classification → Accuracy

---

### 9. Best Model Selection

* compares all models
* selects highest scoring algorithm
* stores best parameters

---

### 10. Fallback System

If all models fail:

* uses Random Forest
* ensures system does not crash

---

### 11. Output

Example response:

```json
{
  "type": "classification",
  "best_algorithm": "RandomForest",
  "best_params": {
    "n_estimators": 100,
    "max_depth": 10
  },
  "score": 0.92,
  "results": {
    "RandomForest": 0.92,
    "DecisionTree": 0.85
  },
  "n_features": 5,
  "n_rows": 200,
  "target_column": "Purchased"
}
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript

### Backend

* FastAPI
* Python

### Machine Learning

* Scikit-learn
* Pandas
* NumPy

---

## 🚀 How to Run the Project

### 🔹 Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Example Use Case

Upload a dataset like:

* house prices
* customer churn
* sales prediction

System will:

* detect target
* train models
* recommend best algorithm

---

## ⚠️ Limitations

* target detection is heuristic based
* depends on dataset quality
* no deep feature engineering

---

## 🔮 Future Improvements

* smarter target detection using correlation
* AutoML integration
* feature importance visualization
* model explainability (SHAP)

---

## ⚡ One Line Summary

👉 An intelligent system that selects and optimizes the best machine learning algorithm for any dataset automatically.

---

## 👨‍💻 Author

Rahul Sah
GitHub: https://github.com/rahulsah05

---
