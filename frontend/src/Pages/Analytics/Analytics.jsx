import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'chart.js/auto'; // Автоматическая регистрация всех компонентов
import { Bar, Line, Scatter,Pie } from 'react-chartjs-2';
import styles from './Analytics.module.css';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [routeLoadData, setRouteLoadData] = useState({});
  const [revenueCostsData, setRevenueCostsData] = useState({});
  const [averageTravelTimeData, setAverageTravelTimeData] = useState({});
  const [passengerFlowTrendsData, setPassengerFlowTrendsData] = useState({});
  const [profitabilityByRouteData, setProfitabilityByRouteData] = useState([])
  const [loading, setLoading] = useState(true);

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
        const response = await axios.get('http://127.0.0.1:8000/api/analytics/', axiosConfig);
        setAnalyticsData(response.data);
      
        const routeLoadResponse = await axios.get('http://127.0.0.1:8000/api/route-load/', axiosConfig);
        setRouteLoadData(routeLoadResponse.data);

        const revenueCostsResponse = await axios.get('http://127.0.0.1:8000/api/revenue-costs/', axiosConfig);
        setRevenueCostsData(revenueCostsResponse.data);

        const averageTravelTimeResponse = await axios.get('http://127.0.0.1:8000/api/average-travel-time/', axiosConfig);
        setAverageTravelTimeData(averageTravelTimeResponse.data);

        const passengerFlowTrendsResponse = await axios.get('http://127.0.0.1:8000/api/passenger-flow-trends/', axiosConfig);
        setPassengerFlowTrendsData(passengerFlowTrendsResponse.data);

        const profitabilityByRouteResponse = await axios.get('http://127.0.0.1:8000/api/profitability-by-route/', axiosConfig);
        setProfitabilityByRouteData(profitabilityByRouteResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении данных аналитики:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


 
 
  if (loading) {
    return <div>Загрузка...</div>;
  }

  const routeLoadChart = {
    labels: routeLoadData.map(d => d.route),
    datasets: [
      {
        label: 'Количество пассажиров',
        data: routeLoadData.map(d => d.passenger_flow),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const revenueCostsChart = {
    labels: Object.keys(revenueCostsData),
    datasets: [
      {
        label: 'Доходы',
        data: Object.values(revenueCostsData).map(d => d.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Затраты',
        data: Object.values(revenueCostsData).map(d => d.costs),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  const averageTravelTimeChart = {
    labels: averageTravelTimeData.map(d => d.route),
    datasets: [
      {
        label: 'Среднее время в пути (мин)',
        data: averageTravelTimeData.map(d => d.avg_travel_time),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
     
        borderWidth: 1,
      }
    ]
  };

  const cleanedPassengerFlowData = passengerFlowTrendsData.filter(d => d.passenger_flows.length > 0);

  const passengerFlowTrendsChart = {
    labels: cleanedPassengerFlowData.length > 0 
      ? cleanedPassengerFlowData[0].passenger_flows.map(d => new Date(d.date).toLocaleDateString())
      : [],
    datasets: cleanedPassengerFlowData.map(routeData => ({
      label: routeData.route,
      data: routeData.passenger_flows.map(d => d.passenger_flow),
      fill: false,
      borderColor: getRandomColor(),
      borderWidth: 2,
    }))
  };


  const profitabilityByRouteChart = {
    labels: profitabilityByRouteData.map(d => d.route),
    datasets: [
      {
        label: 'Рентабельность (%)',
        data: profitabilityByRouteData.map(d => d.profitability),
        backgroundColor: profitabilityByRouteData.map(() => getRandomColor()),
      }
    ]
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  


  return (
    <div className={styles.analytics}>
      <div className={styles.analyticsHeader}>
        <h2>Аналитическая панель</h2>
      </div>
      <div className={styles.analyticsSummary}>
        <div>
          <h3>Общие затраты</h3>
          <p>{analyticsData.total_costs}</p>
        </div>
        <div>
          <h3>Общая выручка</h3>
          <p>{analyticsData.total_revenue}</p>
        </div>
        <div>
          <h3>Средняя рентабельность</h3>
          <p>{analyticsData.avg_profitability}%</p>
        </div>
      </div>


      <div className={styles.chartContainer}>
        <h3>Загруженность маршрутов</h3>
        <div className={styles.chart}>
          <Bar data={routeLoadChart} />
        </div>
      </div>
      <div className={styles.chartContainer}>
        <h3>Доходы и затраты по маршрутам</h3>
        <div className={styles.chart}>
          <Bar data={revenueCostsChart} />
        </div>
      </div>
      <div className={styles.chartContainer}>
        <h3>Среднее время в пути</h3>
        <div className={styles.chart}>
          <Bar data={averageTravelTimeChart} />
        </div>
      </div>
      <div className={styles.chartContainer}>
        <h3>Тренды пассажиропотока</h3>
        <div className={styles.chart}>
          <Line data={passengerFlowTrendsChart} />
        </div>
      </div>
      <div className={styles.chartContainer}>
        <h3>Рентабельность по маршрутам</h3>
        <div className={styles.chart}>
          <Pie data={profitabilityByRouteChart} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
