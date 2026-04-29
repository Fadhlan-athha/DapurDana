export const demoPredictionPayload = { businessProfile: {"businessType":"Ayam Geprek","dailyRevenue":1500000,"hppPercentage":48,"cashBalance":3500000,"operationalExpensePerDay":250000}, ingredients: [{"commodity":"cabai-merah","name":"Cabai Merah","dailyUsage":2.5,"stockDays":2},{"commodity":"daging-ayam","name":"Daging Ayam","dailyUsage":12,"stockDays":1},{"commodity":"minyak-kemasan","name":"Minyak Kemasan","dailyUsage":4,"stockDays":3}] };

export const demoPrediction = {
  "status": "Kritis",
  "komoditas": "Beras Premium",
  "generatedAt": "2026-04-29T13:36:34.539Z",
  "horizonDays": 7,
  "businessProfile": {
    "businessType": "Ayam Geprek",
    "dailyRevenue": 1500000,
    "hppPercentage": 48,
    "cashBalance": 3500000,
    "operationalExpensePerDay": 250000
  },
  "summary": "Margin Ayam Geprek diproyeksikan kritis dalam 7 hari ke depan.",
  "margin": {
    "currentDailyGrossProfit": 780000,
    "projectedDailyGrossProfit": 795895,
    "dailyMarginLoss": -15895,
    "weeklyMarginRisk": -111265,
    "currentMarginPercentage": 52,
    "projectedMarginPercentage": 53.06,
    "projectedHppPercentage": 46.94
  },
  "runway": {
    "cashBalance": 3500000,
    "currentRunwayDays": 3.7,
    "projectedRunwayDays": 3.8,
    "runwayDeltaDays": -0.1,
    "projectedDailyCashBurn": 930880
  },
  "forecasts": [
    {
      "commodity": "daging-ayam",
      "name": "Daging Ayam",
      "category": "Protein",
      "unit": "kg",
      "currentPrice": 39846,
      "predictedPrice": 38669,
      "confidence": 0.95,
      "rmse": 2329.7,
      "mape": 3.67,
      "volatilityIndex": 0.31,
      "source": "xgboost-local-model",
      "modelFile": "model_ayam.pkl",
      "lastActualDate": "2026-04-29",
      "forecastPath": [
        {
          "date": "2026-04-30",
          "price": 39131,
          "day": 1
        },
        {
          "date": "2026-05-01",
          "price": 39281,
          "day": 2
        },
        {
          "date": "2026-05-02",
          "price": 38970,
          "day": 3
        },
        {
          "date": "2026-05-03",
          "price": 38960,
          "day": 4
        },
        {
          "date": "2026-05-04",
          "price": 39048,
          "day": 5
        },
        {
          "date": "2026-05-05",
          "price": 38977,
          "day": 6
        },
        {
          "date": "2026-05-06",
          "price": 38669,
          "day": 7
        }
      ],
      "changePercent": -2.95,
      "direction": "down",
      "riskLevel": "Aman",
      "ingredientImpact": {
        "dailyCostNow": 478152,
        "dailyCostProjected": 464028,
        "dailyDelta": -14124,
        "weeklyDelta": -98868,
        "stockDays": 1
      }
    },
    {
      "commodity": "cabai-merah",
      "name": "Cabai Merah",
      "category": "Sayuran",
      "unit": "kg",
      "currentPrice": 52438,
      "predictedPrice": 53024,
      "confidence": 0.95,
      "rmse": 3898.55,
      "mape": 4.3,
      "volatilityIndex": 1,
      "source": "xgboost-local-model",
      "modelFile": "model_cabai.pkl",
      "lastActualDate": "2026-04-29",
      "forecastPath": [
        {
          "date": "2026-04-30",
          "price": 53260,
          "day": 1
        },
        {
          "date": "2026-05-01",
          "price": 52727,
          "day": 2
        },
        {
          "date": "2026-05-02",
          "price": 52533,
          "day": 3
        },
        {
          "date": "2026-05-03",
          "price": 52695,
          "day": 4
        },
        {
          "date": "2026-05-04",
          "price": 52396,
          "day": 5
        },
        {
          "date": "2026-05-05",
          "price": 52745,
          "day": 6
        },
        {
          "date": "2026-05-06",
          "price": 53024,
          "day": 7
        }
      ],
      "changePercent": 1.12,
      "direction": "up",
      "riskLevel": "Aman",
      "ingredientImpact": {
        "dailyCostNow": 131095,
        "dailyCostProjected": 132560,
        "dailyDelta": 1465,
        "weeklyDelta": 10255,
        "stockDays": 2
      }
    },
    {
      "commodity": "beras-premium",
      "name": "Beras Premium",
      "category": "Bahan Pokok",
      "unit": "kg",
      "currentPrice": 14858,
      "predictedPrice": 15183,
      "confidence": 0.95,
      "rmse": 158.97,
      "mape": 0.95,
      "volatilityIndex": 0.09,
      "source": "xgboost-local-model",
      "modelFile": "model_beras_premium.pkl",
      "lastActualDate": "2026-04-29",
      "forecastPath": [
        {
          "date": "2026-04-30",
          "price": 14951,
          "day": 1
        },
        {
          "date": "2026-05-01",
          "price": 15014,
          "day": 2
        },
        {
          "date": "2026-05-02",
          "price": 15046,
          "day": 3
        },
        {
          "date": "2026-05-03",
          "price": 15076,
          "day": 4
        },
        {
          "date": "2026-05-04",
          "price": 15107,
          "day": 5
        },
        {
          "date": "2026-05-05",
          "price": 15135,
          "day": 6
        },
        {
          "date": "2026-05-06",
          "price": 15183,
          "day": 7
        }
      ],
      "changePercent": 2.19,
      "direction": "up",
      "riskLevel": "Aman",
      "ingredientImpact": null
    },
    {
      "commodity": "beras-medium",
      "name": "Beras Medium",
      "category": "Bahan Pokok",
      "unit": "kg",
      "currentPrice": 13294,
      "predictedPrice": 13127,
      "confidence": 0.95,
      "rmse": 111.85,
      "mape": 0.64,
      "volatilityIndex": 0.15,
      "source": "xgboost-local-model",
      "modelFile": "model_beras_medium.pkl",
      "lastActualDate": "2026-04-29",
      "forecastPath": [
        {
          "date": "2026-04-30",
          "price": 13169,
          "day": 1
        },
        {
          "date": "2026-05-01",
          "price": 13125,
          "day": 2
        },
        {
          "date": "2026-05-02",
          "price": 13095,
          "day": 3
        },
        {
          "date": "2026-05-03",
          "price": 13115,
          "day": 4
        },
        {
          "date": "2026-05-04",
          "price": 13131,
          "day": 5
        },
        {
          "date": "2026-05-05",
          "price": 13159,
          "day": 6
        },
        {
          "date": "2026-05-06",
          "price": 13127,
          "day": 7
        }
      ],
      "changePercent": -1.26,
      "direction": "down",
      "riskLevel": "Aman",
      "ingredientImpact": null
    },
    {
      "commodity": "minyak-kemasan",
      "name": "Minyak Kemasan",
      "category": "Minyak",
      "unit": "liter",
      "currentPrice": 21882,
      "predictedPrice": 21073,
      "confidence": 0.95,
      "rmse": 406.36,
      "mape": 1.25,
      "volatilityIndex": 0.19,
      "source": "xgboost-local-model",
      "modelFile": "model_minyak_kemasan.pkl",
      "lastActualDate": "2026-04-29",
      "forecastPath": [
        {
          "date": "2026-04-30",
          "price": 20907,
          "day": 1
        },
        {
          "date": "2026-05-01",
          "price": 20851,
          "day": 2
        },
        {
          "date": "2026-05-02",
          "price": 20850,
          "day": 3
        },
        {
          "date": "2026-05-03",
          "price": 20868,
          "day": 4
        },
        {
          "date": "2026-05-04",
          "price": 20957,
          "day": 5
        },
        {
          "date": "2026-05-05",
          "price": 20964,
          "day": 6
        },
        {
          "date": "2026-05-06",
          "price": 21073,
          "day": 7
        }
      ],
      "changePercent": -3.7,
      "direction": "down",
      "riskLevel": "Aman",
      "ingredientImpact": {
        "dailyCostNow": 87528,
        "dailyCostProjected": 84292,
        "dailyDelta": -3236,
        "weeklyDelta": -22652,
        "stockDays": 3
      }
    },
    {
      "commodity": "minyak-curah",
      "name": "Minyak Curah",
      "category": "Minyak",
      "unit": "liter",
      "currentPrice": 21333,
      "predictedPrice": 18766,
      "confidence": 0.95,
      "rmse": 1350.88,
      "mape": 5.2,
      "volatilityIndex": 0.83,
      "source": "xgboost-local-model",
      "modelFile": "model_minyak_curah.pkl",
      "lastActualDate": "2026-04-29",
      "forecastPath": [
        {
          "date": "2026-04-30",
          "price": 18916,
          "day": 1
        },
        {
          "date": "2026-05-01",
          "price": 18806,
          "day": 2
        },
        {
          "date": "2026-05-02",
          "price": 18807,
          "day": 3
        },
        {
          "date": "2026-05-03",
          "price": 18778,
          "day": 4
        },
        {
          "date": "2026-05-04",
          "price": 18751,
          "day": 5
        },
        {
          "date": "2026-05-05",
          "price": 18756,
          "day": 6
        },
        {
          "date": "2026-05-06",
          "price": 18766,
          "day": 7
        }
      ],
      "changePercent": -12.03,
      "direction": "down",
      "riskLevel": "Aman",
      "ingredientImpact": null
    },
    {
      "commodity": "tepung-kemasan",
      "name": "Tepung Kemasan",
      "category": "Bahan Pokok",
      "unit": "kg",
      "currentPrice": 12118,
      "predictedPrice": 12353,
      "confidence": 0.95,
      "rmse": 192.85,
      "mape": 1.27,
      "volatilityIndex": 0.22,
      "source": "xgboost-local-model",
      "modelFile": "model_tepung_kemasan.pkl",
      "lastActualDate": "2026-04-29",
      "forecastPath": [
        {
          "date": "2026-04-30",
          "price": 12291,
          "day": 1
        },
        {
          "date": "2026-05-01",
          "price": 12340,
          "day": 2
        },
        {
          "date": "2026-05-02",
          "price": 12318,
          "day": 3
        },
        {
          "date": "2026-05-03",
          "price": 12317,
          "day": 4
        },
        {
          "date": "2026-05-04",
          "price": 12360,
          "day": 5
        },
        {
          "date": "2026-05-05",
          "price": 12356,
          "day": 6
        },
        {
          "date": "2026-05-06",
          "price": 12353,
          "day": 7
        }
      ],
      "changePercent": 1.94,
      "direction": "up",
      "riskLevel": "Aman",
      "ingredientImpact": null
    }
  ],
  "recommendations": [
    {
      "priority": "low",
      "actionCode": "MONITOR",
      "title": "Daging Ayam sedang turun",
      "message": "Harga Daging Ayam turun -2.95%. Tunda restock besar untuk mendapat harga lebih baik esok hari.",
      "estimatedSaving": 98868
    },
    {
      "priority": "low",
      "actionCode": "MONITOR",
      "title": "Minyak Kemasan sedang turun",
      "message": "Harga Minyak Kemasan turun -3.7%. Tunda restock besar untuk mendapat harga lebih baik esok hari.",
      "estimatedSaving": 22652
    },
    {
      "priority": "low",
      "actionCode": "MONITOR",
      "title": "Cabai Merah masih terkendali",
      "message": "Harga Cabai Merah relatif stabil. Lanjutkan pembelian normal.",
      "estimatedSaving": 0
    },
    {
      "priority": "low",
      "actionCode": "MONITOR",
      "title": "Peluang Pasar: Minyak Curah",
      "message": "Harga Minyak Curah turun drastis -12.03%. Peluang bagus untuk eksplorasi menu baru.",
      "estimatedSaving": 0
    }
  ]
};
