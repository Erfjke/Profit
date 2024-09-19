import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ForecastingPage.module.css';

const ForecastingPage = () => {
  const [transports, setTransports] = useState([]);
  const [routes, setRoutes] = useState();
  const [forecast, setForecast] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState('');
  const [modelType, setModelType] = useState('default');
  const [parameters, setParameters] = useState({
    predicted_revenue: false,
    predicted_passenger_flow: false,
    predicted_profitability: true,
  });

  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    withCredentials: true
  };

  useEffect(() => {
    const fetchData = async () => {
     
      try {
        await fetchRoutes();
        await fetchTransports();
      } catch (error) {
        console.error('Error fetching data:', error);
      
      } 
    };

    fetchData();
  }, []);

  const fetchTransports = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/transports/', axiosConfig);
      setTransports(response.data);
    } catch (error) {
      console.error('Error fetching transports:', error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/routes/', axiosConfig);
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const handlePredict = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/predict/', {
        transport_id: selectedTransport,
        model: modelType,
        parameters: Object.keys(parameters).filter(key => parameters[key])
      }, axiosConfig);
      setForecast(response.data);
    } catch (error) {
      console.error('Error predicting forecast:', error);
    }
  };

  const handleTransportChange = (e) => {
    setSelectedTransport(e.target.value);
  };

  const handleModelTypeChange = (e) => {
    setModelType(e.target.value);
  };

  const handleParameterChange = (e) => {
    const { name, checked } = e.target;
    setParameters({
      ...parameters,
      [name]: checked
    });
  };
  const renderTable = (forecast) => {
    const columns = Object.keys(forecast);
    return (
      <table className={styles.forecastTable}>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map(column => (
              <td key={column}>{forecast[column]}</td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

 
  return (
    <div className={styles.Forecasing}>
      <div className={styles.form}>
        <h1>Прогнозирование рентабельности</h1>
        <h3>Выберите параметры для прогнозирования</h3>
        <div>
          <label>Выберите перевозку:</label>
          <select value={selectedTransport} onChange={handleTransportChange}>
            <option value="">Выберите перевозку</option>
            {transports.map((transport) => {
              const route = routes.find(route => route.id === transport.route);
              return (
                <option key={transport.id} value={transport.id}>
                  {route.start_location} - {route.end_location} ({transport.transport_date})
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Выберите модель:</label>
          <select value={modelType} onChange={handleModelTypeChange}>
            <option value="default">Default</option>
            <option value="advanced">Advanced</option>
            <option value="complex">Complex</option>
           
          </select>
        </div>
        <div>
          <label>Выберите параметры:</label>
          <div>
            <input
              type="checkbox"
              name="predicted_revenue"
              checked={parameters.predicted_revenue}
              onChange={handleParameterChange}
            />
            <label>Прогнозируемый доход</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="predicted_passenger_flow"
              checked={parameters.predicted_passenger_flow}
              onChange={handleParameterChange}
            />
            <label>Прогнозируемый пассажиропоток</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="predicted_profitability"
              checked={parameters.predicted_profitability}
              onChange={handleParameterChange}
            />
            <label>Прогнозируемая рентабельность</label>
          </div>
        </div>
        <button onClick={handlePredict}>Прогнозировать</button>
      </div>
      {forecast && (
        <div className={styles.result}>
          <h2>Результаты прогнозирования</h2>
          {renderTable(forecast)}
        </div>
      )}
    </div>
  );
};

export default ForecastingPage;
