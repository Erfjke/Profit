import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Report.module.css';

const ReportPage = () => {
  const [transports, setTransports] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [periodReportUrl, setPeriodReportUrl] = useState('');

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
    const fetchTransports = async () => {
      await fetchTrans();
    };
    fetchTransports();
  }, []);

  const fetchTrans = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/transportsList/');
      setTransports(response.data);
    } catch (error) {
      console.error('Error fetching transports:', error);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/generate-report/${selectedTransport}/`, {
        responseType: 'blob',
        ...axiosConfig
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при генерации отчета:', error);
      setLoading(false);
    }
  };

  const handleGeneratePeriodReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/generate-period-report/', {
        start_date: startDate,
        end_date: endDate
      }, {
        responseType: 'blob',
        ...axiosConfig
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'period_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при генерации отчета за период:', error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.reportPage}>
      <h2>Генерация отчета</h2>
      <div className={styles.form}>
        <label htmlFor="transport">Выберите перевозку:</label>
        <select
          id="transport"
          value={selectedTransport}
          onChange={(e) => setSelectedTransport(e.target.value)}
        >
          <option value="">Выберите перевозку</option>
          {transports.map((transport) => (
            <option key={transport.id} value={transport.id}>
              {transport.route} ({transport.transport_date})  с {transport.departure_time} до {transport.arrival_time}
            </option>
          ))}
        </select>
        <button onClick={handleGenerateReport} disabled={!selectedTransport || loading}>
          {loading ? 'Генерация...' : 'Скачать отчет'}
        </button>
      </div>
      <h2>Генерация отчета за период</h2>
      <div className={styles.form}>
        <label htmlFor="start-date">Начальная дата:</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="end-date">Конечная дата:</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleGeneratePeriodReport} disabled={!startDate || !endDate || loading}>
          {loading ? 'Генерация...' : 'Скачать отчет за период'}
        </button>
      </div>
    </div>
  );
};

export default ReportPage;