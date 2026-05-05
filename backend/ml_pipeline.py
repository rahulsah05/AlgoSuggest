import warnings
import pandas as pd
import numpy as np

from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline

from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

warnings.filterwarnings("ignore", category=UserWarning)

MAX_ROWS = 10000


# ------------------ helpers ------------------

def _safe_label_encode(series):
    return LabelEncoder().fit_transform(
        series.astype(str).fillna("NaN_VALUE")
    )


def _detect_problem_type(y_raw):
    y_num = pd.to_numeric(y_raw, errors="coerce")
    if y_num.notna().sum() > 0 and y_num.nunique() > 20:
        return "regression"
    return "classification"


# ✅ NEW HELPER FUNCTION
def get_target_column(df, user_target=None):
    if user_target and user_target in df.columns:
        return user_target

    keywords = ["target", "label", "class", "price"]

    for col in df.columns:
        if col.lower() in keywords:
            return col

    return df.columns[-1]


# ------------------ main ------------------

def run_pipeline(file_path, target_col=None):

    # ---------- LOAD ----------
    df = pd.read_csv(file_path)

    if len(df) < 10:
        return {"error": "Dataset too small"}

    # ---------- LIMIT SIZE ----------
    if len(df) > MAX_ROWS:
        df = df.sample(MAX_ROWS, random_state=42)

    n_rows = len(df)

    # ---------- CLEAN ----------
    df.replace(["?", "NA", "N/A", "null", "NULL", ""], np.nan, inplace=True)
    df.replace([np.inf, -np.inf], np.nan, inplace=True)

    # ---------- TARGET ----------
    target_col = get_target_column(df, target_col)

    if target_col not in df.columns:
        return {"error": f"Target column '{target_col}' not found"}

    y_raw = df[target_col]
    X = df.drop(columns=[target_col])

    if X.shape[1] == 0:
        return {"error": "No usable features"}

    X = X.apply(pd.to_numeric, errors="coerce")
    X = X.replace([np.inf, -np.inf], np.nan)
    X = X.fillna(0)
    X = X.astype(float)

    # ---------- PROBLEM TYPE ----------
    problem_type = _detect_problem_type(y_raw)

    if problem_type == "classification":
        y = _safe_label_encode(y_raw)

        if len(np.unique(y)) < 2:
            return {"error": "Target has no variation"}

    else:
        y = pd.to_numeric(y_raw, errors="coerce")
        y = y.replace([np.inf, -np.inf], np.nan)
        y = y.fillna(0)

        if y.std() == 0:
            return {"error": "Target has no variation"}

    # ---------- FINAL CHECK ----------
    if X.isna().any().any():
        return {"error": "Invalid values remain in features"}

    # ---------- TRAIN WITH GRIDSEARCH ----------
    results = {}
    best_models = {}

    try:
        if problem_type == "regression":

            models = {
                "LinearRegression": (LinearRegression(), {}),
                "Ridge": (
                    Ridge(),
                    {
                        "alpha": [0.1, 1.0, 10.0]
                    }
                ),
                "RandomForest": (
                    RandomForestRegressor(),
                    {
                        "n_estimators": [50, 100],
                        "max_depth": [None, 10],
                        "min_samples_split": [2, 5]
                    }
                )
            }

            for name, (model, params) in models.items():
                try:
                    grid = GridSearchCV(
                        model,
                        params,
                        cv=3,
                        scoring="r2",
                        n_jobs=-1
                    )
                    grid.fit(X, y)

                    results[name] = round(grid.best_score_, 4)
                    best_models[name] = {
                        "model": grid.best_estimator_,
                        "params": grid.best_params_
                    }

                except:
                    results[name] = None

        else:

            models = {
                "LogisticRegression": (
                    Pipeline([
                        ("scaler", StandardScaler()),
                        ("model", LogisticRegression(max_iter=1000))
                    ]),
                    {
                        "model__C": [0.1, 1, 10]
                    }
                ),
                "DecisionTree": (
                    DecisionTreeClassifier(),
                    {
                        "max_depth": [None, 10, 20],
                        "min_samples_split": [2, 5]
                    }
                ),
                "RandomForest": (
                    RandomForestClassifier(),
                    {
                        "n_estimators": [50, 100],
                        "max_depth": [None, 10],
                        "min_samples_split": [2, 5]
                    }
                )
            }

            for name, (model, params) in models.items():
                try:
                    grid = GridSearchCV(
                        model,
                        params,
                        cv=3,
                        n_jobs=-1
                    )
                    grid.fit(X, y)

                    results[name] = round(grid.best_score_, 4)
                    best_models[name] = {
                        "model": grid.best_estimator_,
                        "params": grid.best_params_
                    }

                except:
                    results[name] = None

    except:
        pass

    # ---------- RESULT ----------
    valid = {k: v for k, v in results.items() if v is not None}

    if not valid:
        try:
            if problem_type == "classification":
                model = RandomForestClassifier(n_estimators=50)
            else:
                model = RandomForestRegressor(n_estimators=50)

            model.fit(X, y)
            score = model.score(X, y)

            return {
                "type": problem_type,
                "best_algorithm": "RandomForest (Fallback)",
                "score": round(float(score), 4),
                "warning": "Fallback model used"
            }

        except Exception as e:
            return {
                "error": "Dataset could not be processed",
                "details": str(e)
            }

    sorted_results = dict(sorted(valid.items(), key=lambda x: x[1], reverse=True))
    best_algo = next(iter(sorted_results))
    best_score = sorted_results[best_algo]

    best_params = best_models.get(best_algo, {}).get("params", {})

    # ---------- WARNINGS ----------
    warning = None
    if problem_type == "regression" and best_score < 0.2:
        warning = "Weak regression signal"
    elif problem_type == "classification" and best_score < 0.6:
        warning = "Low accuracy dataset"

    return {
        "type": problem_type,
        "best_algorithm": best_algo,
        "best_params": best_params,
        "score": best_score,
        "results": sorted_results,
        "n_features": X.shape[1],
        "n_rows": n_rows,
        "target_column": target_col,
        **({"warning": warning} if warning else {})
    }