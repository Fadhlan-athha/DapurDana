from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error


ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT_DIR / "machine-learning" / "datasets" / "raw" / "Data_Gabungan_7_Komoditas_Jakarta.csv"
MODEL_DIR = ROOT_DIR / "machine-learning" / "models"
OUTPUT_PATH = ROOT_DIR / "backend" / "data" / "mlForecasts.json"
CLEAN_OUTPUT_PATH = (
    ROOT_DIR
    / "machine-learning"
    / "datasets"
    / "processed"
    / "Data_Gabungan_7_Komoditas_Jakarta_clean.csv"
)

FEATURE_COLUMNS = [
    "lag_1", "lag_3", "lag_7", "lag_14",
    "rolling_mean_7", "rolling_std_7",
    "rolling_mean_30", "rolling_std_30",
    "day_of_week", "day_of_month", "week_of_year", "month", "quarter",
]

COMMODITIES = {
    "daging-ayam": {
        "name": "Daging Ayam",
        "category": "Protein",
        "unit": "kg",
        "column": "Harga_Ayam",
        "model": "model_ayam.pkl",
    },
    "cabai-merah": {
        "name": "Cabai Merah",
        "category": "Sayuran",
        "unit": "kg",
        "column": "Harga_Cabai",
        "model": "model_cabai.pkl",
    },
    "beras-premium": {
        "name": "Beras Premium",
        "category": "Bahan Pokok",
        "unit": "kg",
        "column": "Harga_Beras_Premium",
        "model": "model_beras_premium.pkl",
    },
    "beras-medium": {
        "name": "Beras Medium",
        "category": "Bahan Pokok",
        "unit": "kg",
        "column": "Harga_Beras_Medium",
        "model": "model_beras_medium.pkl",
    },
    "minyak-kemasan": {
        "name": "Minyak Kemasan",
        "category": "Minyak",
        "unit": "liter",
        "column": "Harga_Minyak_Kemasan",
        "model": "model_minyak_kemasan.pkl",
    },
    "minyak-curah": {
        "name": "Minyak Curah",
        "category": "Minyak",
        "unit": "liter",
        "column": "Harga_Minyak_Curah",
        "model": "model_minyak_curah.pkl",
    },
    "tepung-kemasan": {
        "name": "Tepung Kemasan",
        "category": "Bahan Pokok",
        "unit": "kg",
        "column": "Harga_Tepung_Kemasan",
        "model": "model_tepung_kemasan.pkl",
    },
}

def round_float(value: float, decimals: int = 2) -> float:
    return round(float(value), decimals)

def load_price_data(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    df["Tanggal"] = pd.to_datetime(df["Tanggal"])
    df = df.set_index("Tanggal").sort_index()

    full_range = pd.date_range(start=df.index.min(), end=df.index.max(), freq="D")
    df = df.reindex(full_range)
    df.index.name = "Tanggal"

    for _, config in COMMODITIES.items():
        col = config["column"]
        df[col] = df[col].interpolate(method="time").ffill().bfill()

    return df

def save_clean_dataset(df: pd.DataFrame, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    df.reset_index().to_csv(path, index=False)

def create_features(series: pd.Series) -> pd.DataFrame:
    data = pd.DataFrame(index=series.index)
    data["target"] = series

    for lag in [1, 3, 7, 14]:
        data[f"lag_{lag}"] = series.shift(lag)

    for window in [7, 30]:
        shifted = series.shift(1)
        data[f"rolling_mean_{window}"] = shifted.rolling(window=window, min_periods=1).mean()
        data[f"rolling_std_{window}"] = shifted.rolling(window=window, min_periods=1).std()

    data["day_of_week"] = series.index.dayofweek
    data["day_of_month"] = series.index.day
    data["week_of_year"] = series.index.isocalendar().week.astype(int)
    data["month"] = series.index.month
    data["quarter"] = series.index.quarter

    return data.dropna()

def build_next_feature_row(series: pd.Series, forecast_date: pd.Timestamp) -> pd.DataFrame:
    values = {
        "lag_1": series.iloc[-1],
        "lag_3": series.iloc[-3],
        "lag_7": series.iloc[-7],
        "lag_14": series.iloc[-14],
        "rolling_mean_7": series.iloc[-7:].mean(),
        "rolling_std_7": series.iloc[-7:].std(),
        "rolling_mean_30": series.iloc[-30:].mean(),
        "rolling_std_30": series.iloc[-30:].std(),
        "day_of_week": forecast_date.dayofweek,
        "day_of_month": forecast_date.day,
        "week_of_year": int(forecast_date.isocalendar().week),
        "month": forecast_date.month,
        "quarter": forecast_date.quarter,
    }
    return pd.DataFrame([values], columns=FEATURE_COLUMNS)

def evaluate_model(model, series: pd.Series) -> tuple[float, float]:
    features = create_features(series)
    split_index = int(len(features) * 0.8)
    test = features.iloc[split_index:]

    predictions = model.predict(test[FEATURE_COLUMNS])
    rmse = np.sqrt(mean_squared_error(test["target"], predictions))
    mape = mean_absolute_percentage_error(test["target"], predictions) * 100

    return float(rmse), float(mape)

def forecast_series(model, series: pd.Series, horizon_days: int) -> list[dict]:
    working_series = series.copy()
    forecast_rows = []

    for step in range(1, horizon_days + 1):
        forecast_date = working_series.index[-1] + pd.Timedelta(days=1)
        feature_row = build_next_feature_row(working_series, forecast_date)
        predicted_price = float(model.predict(feature_row)[0])
        predicted_price = max(predicted_price, 0)

        working_series.loc[forecast_date] = predicted_price
        forecast_rows.append({
            "date": forecast_date.date().isoformat(),
            "price": round(predicted_price),
            "day": step,
        })

    return forecast_rows

def create_backend_forecasts(horizon_days: int) -> dict:
    df = load_price_data(DATA_PATH)
    save_clean_dataset(df, CLEAN_OUTPUT_PATH)
    generated_at = pd.Timestamp.utcnow().isoformat()
    forecasts = {}

    for commodity_id, config in COMMODITIES.items():
        print(f"Forecasting {config['name']}...")
        series = df[config["column"]]
        model = joblib.load(MODEL_DIR / config["model"])
        path = forecast_series(model, series, horizon_days)
        rmse, mape = evaluate_model(model, series)
        
        current_price = float(series.iloc[-1])
        predicted_price = float(path[-1]["price"])
        returns = series.pct_change().dropna()
        volatility = min(max(float(returns.tail(7).std() * 20), 0), 1)

        forecasts[commodity_id] = {
            "commodity": commodity_id,
            "name": config["name"],
            "category": config["category"],
            "unit": config["unit"],
            "currentPrice": round(current_price),
            "predictedPrice": round(predicted_price),
            "confidence": round_float(max(0.5, min(0.95, 1 - (mape / 100))), 2),
            "rmse": round_float(rmse),
            "mape": round_float(mape),
            "volatilityIndex": round_float(volatility),
            "source": "xgboost-local-model",
            "modelFile": config["model"],
            "lastActualDate": series.index[-1].date().isoformat(),
            "forecastPath": path,
        }

    return {
        "generatedAt": generated_at,
        "horizonDays": horizon_days,
        "dataset": str(DATA_PATH.relative_to(ROOT_DIR)).replace("\\", "/"),
        "forecasts": forecasts,
    }

def main() -> None:
    parser = argparse.ArgumentParser(description="Generate backend forecast JSON from 7 XGBoost models.")
    parser.add_argument("--horizon-days", type=int, default=7)
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH)
    args = parser.parse_args()

    output = create_backend_forecasts(args.horizon_days)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, indent=2), encoding="utf-8")
    print(f"\n✅ Forecast JSON generated: {args.output}")

if __name__ == "__main__":
    main()
