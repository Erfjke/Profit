import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DataManagment.module.css';
const DataManagement = () => {
  const [tab, setTab] = useState('transports'); // 'routes', 'transports', 'forecasts'
  const [transports, setTransports] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [routeSearch, setRouteSearch] = useState('');
  const [transportSearch, setTransportSearch] = useState('');
  const [forecastSearch, setForecastSearch] = useState('');
  const [error, setError] = useState('');


  const [newRoute, setNewRoute] = useState({
    start_location: '',
    end_location: '',
    passenger_flow: ''
  });
  const [newTransport, setNewTransport] = useState({
    route_id: '',
    costs: '',
    transport_date: '',
    departure_time: '',
    arrival_time: '',
    fare: ''
  });
  const [newForecast, setNewForecast] = useState({
    transport_id: '',
    predicted_revenue: '',
    predicted_passenger_flow: '',
    predicted_profitability: ''
  });
  // Получение токена из localStorage
  const getToken = () => {
    return localStorage.getItem('access_token');
  };
  
  // Добавление токена в заголовки
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
        await fetchForecasts();
      } catch (error) {
        console.error('Error fetching data:', error);
      
      } 
    };
    fetchData();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/routes/',axiosConfig);
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchTransports = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/transports/',axiosConfig);
      setTransports(response.data);
    } catch (error) {
      console.error('Error fetching transports:', error);
    }
  };

  const fetchForecasts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/forecasts/',axiosConfig);
      setForecasts(response.data);
    } catch (error) {
      console.error('Error fetching forecasts:', error);
    }
  };

  const handleRouteInputChange = (e) => {
    const { name, value } = e.target;
    const updatedRoute = { ...newRoute, [name]: value };
    if (updatedRoute.start_location && updatedRoute.end_location && updatedRoute.start_location === updatedRoute.end_location) {
      setError('Начальная и конечная точки не могут быть одинаковыми');
    } else {
      setError('')
    }

    setNewRoute({ ...newRoute, [name]: value });



  };

  const handleTransportInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransport({ ...newTransport, [name]: value });
  };

  const handleForecastInputChange = (e) => {
    const { name, value } = e.target;
    setNewForecast({ ...newForecast, [name]: value });
  };

  const handleAddRoute = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/routes/', newRoute,axiosConfig);
      setRoutes([response.data,...routes]);
      setNewRoute({
        start_location: '',
        end_location: '',
        passenger_flow: ''
       
      });
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const handleAddTransport = async () => {
    // Преобразование данных в правильный формат
    const formattedTransport = {
      ...newTransport,
      route: newTransport.route_id,
      costs: parseFloat(newTransport.costs).toFixed(2),
      departure_time: newTransport.departure_time + ":00",
      arrival_time: newTransport.arrival_time + ":00",
      fare : parseFloat(newTransport.fare).toFixed(2)
    };
  
    console.log('Adding transport with data:', formattedTransport); // Логирование данных перед отправкой
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/transports/', formattedTransport,axiosConfig);
      setTransports([response.data,...transports]);
      setNewTransport({
        route_id: '',
        costs: '',
        transport_date: '',
        departure_time: '',
        arrival_time: '',
        fare: ''
      });
    } catch (error) {
      console.error('Error adding transport:', error.response.data);
    }
  };

  const handleAddForecast = async () => {
    console.log('Adding forecast with data:', newForecast); 
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/forecasts/', newForecast,axiosConfig);
      setForecasts([response.data,...forecasts]);
      setNewForecast({
        transport_id: '',
        predicted_revenue: '',
        predicted_passenger_flow: '',
        predicted_profitability:''
      });
    } catch (error) {
      console.error('Error adding forecast:', error);
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/routes/${id}/`,axiosConfig);
      setRoutes(routes.filter((route) => route.id !== id));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const handleDeleteTransport = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/transports/${id}/`,axiosConfig);
      setTransports(transports.filter((transport) => transport.id !== id));
    } catch (error) {
      console.error('Error deleting transport:', error);
    }
  };

  const handleDeleteForecast = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/forecasts/${id}/`,axiosConfig);
      setForecasts(forecasts.filter((forecast) => forecast.id !== id));
    } catch (error) {
      console.error('Error deleting forecast:', error);
    }
  };

  const handleEditTransport = async (id, updatedTransport) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/transports/${id}/`, updatedTransport,axiosConfig);
      setTransports(transports.map((transport) => (transport.id === id ? response.data : transport)));
    } catch (error) {
      console.error('Error updating transport:', error);
    }
  };
  const handleEditRoute = async (id, updatedRoute) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/routes/${id}/`, updatedRoute,axiosConfig);
      setRoutes(routes.map((route) => (route.id === id ? response.data : route)));
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };
  const handleEditForecast = async (id, updatedForecast) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/forecasts/${id}/`, updatedForecast,axiosConfig);
      setForecasts(forecasts.map((forecast) => (forecast.id === id ? response.data : forecast)));
    } catch (error) {
      console.error('Error updating forecast:', error);
    }
  };


    const filteredRoutes = routes.filter(route =>
      route.start_location.toLowerCase().includes(routeSearch.toLowerCase()) ||
      route.end_location.toLowerCase().includes(routeSearch.toLowerCase())||
      route.passenger_flow.toString().includes(routeSearch) // Добавлен фильтр по пассажиропотоку
    );

  
    const filteredTransports = transports.filter(transport => {
      const route = routes.find(route => route.id === transport.route);
      return route.start_location.toLowerCase().includes(transportSearch.toLowerCase()) ||
        route.end_location.toLowerCase().includes(transportSearch.toLowerCase()) ||
        transport.transport_date.includes(transportSearch)||
        transport.fare.toString().includes(transportSearch);
    });
  
    const filteredForecasts = forecasts.filter(forecast => {
      const transport = transports.find(transport => transport.id === forecast.transport_id);
      const route = routes.find(route => route.id === transport.route);
      return route.start_location.toLowerCase().includes(forecastSearch.toLowerCase()) ||
        route.end_location.toLowerCase().includes(forecastSearch.toLowerCase()) ||
        transport.transport_date.includes(forecastSearch)||
        forecast.predicted_profitability.toString().includes(forecastSearch);
        
    });
  return (
    <div className={styles.dataManagement}>
      <div className={styles.tabs}>
        <button  onClick={() => setTab('routes')}>Маршруты</button>
        <button  onClick={() => setTab('transports')}>Перевозки</button>
        <button  onClick={() => setTab('forecasts')}>Прогнозы</button>
      </div>

      {tab === 'transports' && (
        <div>
          <div className={styles.form}>
            <h2>Добавить новую перевозку</h2>
            <select name="route_id" value={newTransport.route_id} onChange={ handleTransportInputChange}>
              <option value="">Выберите маршрут</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.start_location} - {route.end_location}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="costs"
              value={newTransport.costs}
              onChange={ handleTransportInputChange}
              placeholder="Затраты"
            />
            <input
              type="date"
              name="transport_date"
              value={newTransport.transport_date}
              onChange={ handleTransportInputChange}
              placeholder="Дата перевозки"
            />
            <input
              type="time"
              name="departure_time"
              value={newTransport.departure_time}
              onChange={ handleTransportInputChange}
              placeholder="Время отправления"
            />
            <input
              type="time"
              name="arrival_time"
              value={newTransport.arrival_time}
              onChange={ handleTransportInputChange}
              placeholder="Время прибытия"
            />
            <input
              type="number"
              name="fare"
              value={newTransport.fare}
              onChange={ handleTransportInputChange}
              placeholder="Стоимость проезда"
            />
            <button onClick={handleAddTransport}>Добавить</button>
          </div>
          <input
            type="text"
            value={transportSearch}
            onChange={(e) => setTransportSearch(e.target.value)}
            placeholder="Поиск перевозок"
            className={styles.searchInput}
          />

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Маршрут</th>
                <th>Дата</th>
                <th>Время отправления</th>
                <th>Время прибытия</th>
                <th>Затраты</th>
                <th>Стоимость проезда</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransports.map((transport) => (
                <EditableTransportRow
                  key={transport.id}
                  transport={transport}
                  routes={routes}
                  onSave={handleEditTransport}
                  onDelete={handleDeleteTransport}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
 
{tab === 'routes' && (
        <div>
          <div className={styles.form}>
            <h2>Добавить новый маршрут</h2>
            <input
              type="text"
              name="start_location"
              value={newRoute.start_location}
              onChange={handleRouteInputChange}
              placeholder="Начальная точка"
            />
            <input
              type="text"
              name="end_location"
              value={newRoute.end_location}
              onChange={handleRouteInputChange}
              placeholder="Конечная точка"
            />
            <input
              type="number"
              name="passenger_flow"
              value={newRoute.passenger_flow}
              onChange={handleRouteInputChange}
              placeholder="Пассажиропоток"
            />
            <button onClick={handleAddRoute}  disabled={Boolean(error)}>Добавить</button>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="text"
            value={routeSearch}
            onChange={(e) => setRouteSearch(e.target.value)}
            placeholder="Поиск маршрутов"
            className={styles.searchInput}
          />

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Начальная точка</th>
                <th>Конечная точка</th>
                <th>Пассажиропоток</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <EditableRouteRow
                  key={route.id}
                  route={route}
                  onSave={handleEditRoute}
                  onDelete={handleDeleteRoute}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

{tab === 'forecasts' && (
        <div>
          <div className={styles.form}>
            <h2>Добавить новый прогноз</h2>
            <select name="transport_id" value={newForecast.transport_id} onChange={handleForecastInputChange}>
            <option value="">Выберите перевозку</option>
            {transports.map((transport) => {
              const route = routes.find(route => route.id === transport.route);
              return (
                <option key={transport.id} value={transport.id}>
                  {route.start_location} - {route.end_location} ({transport.transport_date})  с {transport.departure_time} до {transport.arrival_time}
                </option>
              );
            })}
            </select>

            <input
              type="number"
              name="predicted_revenue"
              value={newForecast.predicted_revenue}
              onChange={handleForecastInputChange}
              placeholder="Прогнозируемый доход"
            />
            <input
              type="number"
              name="predicted_passenger_flow"
              value={newForecast.predicted_passenger_flow}
              onChange={handleForecastInputChange}
              placeholder="Прогнозируемый пассажиропоток"
            />
            <input
              type="number"
              name="predicted_profitability"
              value={newForecast.predicted_profitability}
              onChange={handleForecastInputChange}
              placeholder="Прогнозируемая рентабельность"
            />
            <button onClick={handleAddForecast}>Добавить</button>
          </div>

          <input
            type="text"
            value={forecastSearch}
            onChange={(e) => setForecastSearch(e.target.value)}
            placeholder="Поиск прогнозов"
            className={styles.searchInput}
          />

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Перевозка</th>
                <th>Прогнозируемый доход</th>
                <th>Прогнозируемый пассажиропоток</th>
                <th>Прогнозируемая рентабельность</th>
                <th>Дата создания</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredForecasts.map((forecast) => (
                <EditableForecastRow
                  key={forecast.id}
                  forecast={forecast}
                  transports={transports}
                  routes={routes}
                  onSave={handleEditForecast}
                  onDelete={handleDeleteForecast}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const EditableTransportRow = ({ transport, routes, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransport, setEditedTransport] = useState({ ...transport });
// Найти маршрут по идентификатору
const routeF = routes.find(route => route.id === transport.route);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTransport({ ...editedTransport, [name]: value });
  };

  const handleSave = () => {
    onSave(transport.id, editedTransport);
    setIsEditing(false);
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <select name="route_id" value={editedTransport.route_id} onChange={handleInputChange}>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.start_location} - {route.end_location}
              </option>
            ))}
          </select>
        ) : (
        routeF.start_location +'-'+ routeF.end_location
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="date"
            name="transport_date"
            value={editedTransport.transport_date}
            onChange={handleInputChange}
          />
        ) : (
          transport.transport_date
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="time"
            name="departure_time"
            value={editedTransport.departure_time}
            onChange={handleInputChange}
          />
        ) : (
          transport.departure_time
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="time"
            name="arrival_time"
            value={editedTransport.arrival_time}
            onChange={handleInputChange}
          />
        ) : (
          transport.arrival_time
        )}
      </td>
      <td>
        {isEditing ? (
          <input type="number" name="costs" value={editedTransport.costs} onChange={handleInputChange} />
        ) : (
          transport.costs
        )}
      </td>
      <td>
        {isEditing ? (
          <input type="number" name="fare" value={editedTransport.fare} onChange={handleInputChange} />
        ) : (
          transport.fare
        )}
      </td>
      <td>
        {isEditing ? (
          <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
        ) : (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Изменить</button>
        )}
        <button className={styles.deleteBtn} onClick={() => onDelete(transport.id)}>Удалить</button>
      </td>
    </tr>
  );
};

const EditableRouteRow = ({ route, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoute, setEditedRoute] = useState({ ...route });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRoute({ ...editedRoute, [name]: value });
  };

  const handleSave = () => {
    onSave(route.id, editedRoute);
    setIsEditing(false);
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input type="text" name="start_location" value={editedRoute.start_location} onChange={handleInputChange} />
        ) : (
          route.start_location
        )}
      </td>
      <td>
        {isEditing ? (
          <input type="text" name="end_location" value={editedRoute.end_location} onChange={handleInputChange} />
        ) : (
          route.end_location
        )}
      </td>
      <td>
        {isEditing ? (
          <input type="number" name="passenger_flow" value={editedRoute.passenger_flow} onChange={handleInputChange} />
        ) : (
          route.passenger_flow
        )}
      </td>
      <td>
        {isEditing ? (
          <button className={styles.saveBtn}  onClick={handleSave}>Сохранить</button>
        ) : (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Изменить</button>
        )}
        <button className={styles.deleteBtn} onClick={() => onDelete(route.id)}>Удалить</button>
      </td>
    </tr>
  );
};

const EditableForecastRow = ({ forecast, transports, onSave, onDelete, routes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedForecast, setEditedForecast] = useState({ ...forecast });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedForecast({ ...editedForecast, [name]: value });
  };

  const handleSave = () => {
    onSave(forecast.id, editedForecast);
    setIsEditing(false);
  };


  return (
    <tr>
      <td>
        {isEditing ? (
           <select name="transport_id" value={editedForecast.transport_id} onChange={handleInputChange}>
           <option value="">Выберите перевозку</option>
           {transports.map((transport) => {
             const route = routes.find(route => route.id === transport.route);
             return (
               <option key={transport.id} value={transport.id}>
                 {route.start_location} - {route.end_location} ({transport.transport_date})  с {transport.departure_time} до {transport.arrival_time}
               </option>
             );
           })}
           </select>

        ) : (
          (() => {
            const transport = transports.find(transport => transport.id === forecast.transport_id);
            if (transport) {
              const route = routes.find(route => route.id === transport.route);
              return route
                ? `${route.start_location} - ${route.end_location} (${transport.transport_date}) с ${transport.departure_time} до ${transport.arrival_time}`
                : 'Маршрут не найден';
            }
            return 'Перевозка не найдена';
          })()
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="predicted_revenue"
            value={editedForecast.predicted_revenue}
            onChange={handleInputChange}
          />
        ) : (
          forecast.predicted_revenue
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="predicted_passenger_flow"
            value={editedForecast.predicted_passenger_flow}
            onChange={handleInputChange}
          />
        ) : (
          forecast.predicted_passenger_flow
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="predicted_profitability"
            value={editedForecast.predicted_profitability}
            onChange={handleInputChange}
          />
        ) : (
          forecast.predicted_profitability
        )}
      </td>
      <td>{new Date(forecast.created_at).toLocaleString()}</td>
      <td>
        {isEditing ? (
          <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
        ) : (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Изменить</button>
        )}
        <button className={styles.deleteBtn} onClick={() => onDelete(forecast.id)}>Удалить</button>
      </td>
    </tr>
  );
};


export default DataManagement;
