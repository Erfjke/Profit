

import numpy as np
import pandas as pd
from keras.src.utils.module_utils import tensorflow
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras.layers import Dense


from .models import Transport, Route, Forecast

from decimal import Decimal
# Функция для загрузки данных из CSV файла

def load_data(file_path):
    return pd.read_csv(file_path)

def prepare_data(df):
    # Преобразование столбцов даты и времени в datetime объекты
    df['transport_date'] = pd.to_datetime(df['transport_date'])
    df['departure_time'] = pd.to_datetime(df['departure_time'], format='%H:%M:%S').dt.time
    df['arrival_time'] = pd.to_datetime(df['arrival_time'], format='%H:%M:%S').dt.time

    # Извлечение полезных признаков из даты и времени
    df['year'] = df['transport_date'].dt.year
    df['month'] = df['transport_date'].dt.month
    df['day'] = df['transport_date'].dt.day
    df['departure_hour'] = pd.to_datetime(df['departure_time'], format='%H:%M:%S').dt.hour
    df['departure_minute'] = pd.to_datetime(df['departure_time'], format='%H:%M:%S').dt.minute
    df['arrival_hour'] = pd.to_datetime(df['arrival_time'], format='%H:%M:%S').dt.hour
    df['arrival_minute'] = pd.to_datetime(df['arrival_time'], format='%H:%M:%S').dt.minute

    # Преобразование категориальных признаков в числовые
    df['route_start'] = df['route_start'].astype('category').cat.codes
    df['route_end'] = df['route_end'].astype('category').cat.codes

    # Определение признаков и целевых переменных
    X = df[['route_start', 'route_end', 'passenger_flow', 'costs', 'fare',
            'year', 'month', 'day', 'departure_hour', 'departure_minute', 'arrival_hour', 'arrival_minute']]
    y = df[['fare', 'passenger_flow', 'costs']]  # Целевые переменные

    # Разделение данных на обучающую и тестовую выборки
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Нормализация данных
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    return X_train, X_test, y_train, y_test


def create_model(input_dim, output_dim, model_type):
    model =  tf.keras.Sequential()

    if model_type == 'default':
        model.add(Dense(64, input_dim=input_dim, activation='relu'))
        model.add(Dense(64, activation='relu'))
        model.add(Dense(output_dim))
        model.compile(optimizer='adam', loss='mean_squared_error')

    elif model_type == 'advanced':
        model.add(Dense(128, input_dim=input_dim, activation='tanh'))
        model.add(Dense(64, activation='sigmoid'))
        model.add(Dense(output_dim))
        model.compile(optimizer='adam', loss='mean_absolute_error')

    elif model_type == 'complex':
        model.add(Dense(256, input_dim=input_dim, activation='relu'))
        model.add(Dense(128, activation='relu'))
        model.add(Dense(64, activation='sigmoid'))
        model.add(Dense(output_dim))
        model.compile(optimizer='adam', loss='mean_squared_error')

    return model


def train_model(X_train, y_train,modelType):
    model = create_model(X_train.shape[1], y_train.shape[1],modelType)
    model.fit(X_train, y_train, epochs=50, batch_size=10, verbose=0)
    return model

def save_forecast(transport, forecast_result):
    # Преобразование типов из numpy.float32 в Decimal
    forecast = Forecast(
        transport_id=transport,
        predicted_revenue=Decimal(forecast_result.get('predicted_revenue', 0)),
        predicted_passenger_flow=int(forecast_result.get('predicted_passenger_flow', 0)),
        predicted_profitability=Decimal(forecast_result.get('predicted_profitability', 0))
    )
    forecast.save()
    return forecast
def predict_profitability(transport_id, model_type, parameters):
    df = load_data('D:\\forecasting_profitability\\backend\\backend_api\\Transport_Data.csv')
    X_train, X_test, y_train, y_test = prepare_data(df)
    model = train_model(X_train, y_train,model_type)

    transport = Transport.objects.get(id=transport_id)
    input_data = pd.DataFrame([{
        'route_start': transport.route.start_location,
        'route_end': transport.route.end_location,
        'passenger_flow': transport.route.passenger_flow,
        'costs': transport.costs,
        'fare': transport.fare,
        'year': transport.transport_date.year,
        'month': transport.transport_date.month,
        'day': transport.transport_date.day,
        'departure_hour': transport.departure_time.hour,
        'departure_minute': transport.departure_time.minute,
        'arrival_hour': transport.arrival_time.hour,
        'arrival_minute': transport.arrival_time.minute
    }])
    input_data['route_start'] = input_data['route_start'].astype('category').cat.codes
    input_data['route_end'] = input_data['route_end'].astype('category').cat.codes

    scaler = StandardScaler()
    input_data = scaler.fit_transform(input_data)

    predictions = model.predict(input_data)[0]

    forecast_result = {}
    if 'predicted_revenue' in parameters:
        forecast_result['predicted_revenue'] = float(predictions[0])
    if 'predicted_passenger_flow' in parameters:
        forecast_result['predicted_passenger_flow'] = int(predictions[1])
    if 'predicted_costs' in parameters:
        forecast_result['predicted_costs'] = float(predictions[2])
    if 'predicted_profitability' in parameters:
        forecast_result['predicted_profitability'] = float(predictions[0] / predictions[2] * 100)



    # Сохраняем результат в базу данных
    save_forecast(transport, forecast_result)

    return forecast_result