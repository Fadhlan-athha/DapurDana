"""
===========================================================================
DapurDana - Forecasting Pipeline
===========================================================================
Commodity Price Forecasting: 7 Komoditas Strategis (Jakarta)
Model     : XGBoost Regressor (per-commodity)
Data      : Data_Gabungan_7_Komoditas_Jakarta.csv
Author    : ML Engineering Team – DapurDana
===========================================================================
"""

import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error
import joblib
from pathlib import Path

# =========================================================================
# 1. DATA LOADING & CLEANING
# =========================================================================
print("=" * 65)
print(" [1/6] DATA LOADING & CLEANING")
print("=" * 65)

DATA_PATH = Path(__file__).resolve().parents[1] / "datasets" / "raw" / "Data_Gabungan_7_Komoditas_Jakarta.csv"
MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(DATA_PATH)
df["Tanggal"] = pd.to_datetime(df["Tanggal"])
df = df.set_index("Tanggal")
df = df.sort_index()

print(f"  ✓ Dataset loaded: {df.shape[0]} rows  |  Range: {df.index.min().date()} → {df.index.max().date()}")

# --- Reindex to daily frequency to expose missing dates ----
full_range = pd.date_range(start=df.index.min(), end=df.index.max(), freq="D")
df = df.reindex(full_range)
df.index.name = "Tanggal"

# Define the 7 target columns
TARGET_COLUMNS = [
    "Harga_Ayam",
    "Harga_Cabai",
    "Harga_Beras_Premium",
    "Harga_Beras_Medium",
    "Harga_Minyak_Kemasan",
    "Harga_Minyak_Curah",
    "Harga_Tepung_Kemasan"
]

missing_before = df.isna().sum()
print(f"  ✓ Reindexed to daily frequency: {len(df)} days")
print(f"  ✓ Missing values detected (sample): Ayam={missing_before['Harga_Ayam']}, Cabai={missing_before['Harga_Cabai']}")

# --- Time-series interpolation (time-aware) ---
for col in TARGET_COLUMNS:
    df[col] = df[col].interpolate(method="time").ffill().bfill()

missing_after = df.isna().sum().sum()
print(f"  ✓ After time-series interpolation: {missing_after} missing values remaining")

# --- IQR Outlier Capping ---
print("  ✓ Applying IQR Outlier Capping...")
for col in TARGET_COLUMNS:
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers_count = ((df[col] < lower_bound) | (df[col] > upper_bound)).sum()
    if outliers_count > 0:
        df[col] = np.clip(df[col], lower_bound, upper_bound)
        print(f"      - {col}: {outliers_count} outliers capped")

print()

# =========================================================================
# 2. ADVANCED FEATURE ENGINEERING
# =========================================================================
print("=" * 65)
print(" [2/6] ADVANCED FEATURE ENGINEERING")
print("=" * 65)

def create_features(df: pd.DataFrame, col: str) -> pd.DataFrame:
    data = pd.DataFrame(index=df.index)
    data["target"] = df[col]

    for lag in [1, 3, 7, 14]:
        data[f"lag_{lag}"] = df[col].shift(lag)

    for window in [7, 30]:
        data[f"rolling_mean_{window}"] = df[col].shift(1).rolling(window=window, min_periods=1).mean()
        data[f"rolling_std_{window}"] = df[col].shift(1).rolling(window=window, min_periods=1).std()

    data["day_of_week"] = df.index.dayofweek
    data["day_of_month"] = df.index.day
    data["week_of_year"] = df.index.isocalendar().week.astype(int)
    data["month"] = df.index.month
    data["quarter"] = df.index.quarter

    return data.dropna()

dfs_features = {}
for col in TARGET_COLUMNS:
    dfs_features[col] = create_features(df, col)

feature_cols = [c for c in dfs_features[TARGET_COLUMNS[0]].columns if c != "target"]
print(f"  ✓ Features generated ({len(feature_cols)} features per commodity)")
print()

# =========================================================================
# 3. TRAIN / TEST SPLIT  (Chronological 80/20)
# =========================================================================
print("=" * 65)
print(" [3/6] CHRONOLOGICAL TRAIN / TEST SPLIT")
print("=" * 65)

def chrono_split(data: pd.DataFrame, train_ratio: float = 0.8):
    n = len(data)
    split_idx = int(n * train_ratio)
    return data.iloc[:split_idx], data.iloc[split_idx:]

splits = {}
for col in TARGET_COLUMNS:
    train, test = chrono_split(dfs_features[col])
    splits[col] = {"train": train, "test": test}

print(f"  ✓ Split completed for {len(TARGET_COLUMNS)} commodities")
print()

# =========================================================================
# 4. MODEL TRAINING  (XGBoost with tuned hyperparameters)
# =========================================================================
print("=" * 65)
print(" [4/6] MODEL TRAINING — XGBoost Regressor")
print("=" * 65)

xgb_params = dict(
    n_estimators=500,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    min_child_weight=5,
    random_state=42,
    n_jobs=-1,
    early_stopping_rounds=30,
)

models = {}
for col in TARGET_COLUMNS:
    print(f"  Training model for {col}...")
    X_train = splits[col]["train"][feature_cols]
    y_train = splits[col]["train"]["target"]
    X_test = splits[col]["test"][feature_cols]
    y_test = splits[col]["test"]["target"]

    model = XGBRegressor(**xgb_params)
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False,
    )
    models[col] = model
    print(f"    ✓ Best iteration: {model.best_iteration}")

print()

# =========================================================================
# 5. EVALUASI  (RMSE & MAPE)
# =========================================================================
print("=" * 65)
print(" [5/6] EVALUASI MODEL")
print("=" * 65)

results = []
for col in TARGET_COLUMNS:
    model = models[col]
    X_test = splits[col]["test"][feature_cols]
    y_test = splits[col]["test"]["target"]
    
    pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, pred))
    mape = mean_absolute_percentage_error(y_test, pred) * 100
    results.append({"Komoditas": col, "RMSE": rmse, "MAPE": mape})

print("  ┌────────────────────────────────────────────────────────┐")
print("  │          HASIL EVALUASI  —  TEST SET                   │")
print("  ├──────────────────────┬───────────────┬─────────────────┤")
print("  │   Komoditas          │   RMSE (Rp)   │   MAPE (%)      │")
print("  ├──────────────────────┼───────────────┼─────────────────┤")
for res in results:
    print(f"  │ {res['Komoditas']:<20} │ {res['RMSE']:>11,.0f}   │ {res['MAPE']:>9.2f}%      │")
print("  └──────────────────────┴───────────────┴─────────────────┘")
print()

# =========================================================================
# 6. EXPORT MODEL  (.pkl via joblib)
# =========================================================================
print("=" * 65)
print(" [6/6] EXPORT MODEL")
print("=" * 65)

FILE_MAP = {
    "Harga_Ayam": "model_ayam.pkl",
    "Harga_Cabai": "model_cabai.pkl",
    "Harga_Beras_Premium": "model_beras_premium.pkl",
    "Harga_Beras_Medium": "model_beras_medium.pkl",
    "Harga_Minyak_Kemasan": "model_minyak_kemasan.pkl",
    "Harga_Minyak_Curah": "model_minyak_curah.pkl",
    "Harga_Tepung_Kemasan": "model_tepung_kemasan.pkl"
}

for col, filename in FILE_MAP.items():
    path = MODEL_DIR / filename
    joblib.dump(models[col], path)
    print(f"  ✓ {filename}  → {path}")

print()
print("=" * 65)
print(" ✅ PIPELINE SELESAI — 7 Model siap digunakan oleh Backend!")
print("=" * 65)
