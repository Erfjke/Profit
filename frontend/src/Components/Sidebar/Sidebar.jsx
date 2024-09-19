import React from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import Logo from '../../images/Logo.png'; 
import ReportIcon from '../../images/Report.png';
import ProfileIcon from '../../images/profile.png';
import ForecastingIcon from '../../images/forecast.png';
import DataManagementIcon from '../../images/data-management.png';
import AnalyticsIcon from '../../images/analytics.png';
import LogoutIcon from '../../images/logout.png';
import axios from 'axios';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post(
      'http://localhost:8000/api/logout',
      {
        refresh_token: localStorage.getItem('refresh_token'),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        withCredentials: true
      }
      
    )
    .then(response => {
      if (response.status === 200) {
        // Очистка данных из localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('id');
        localStorage.removeItem('username');

        // Перенаправление на страницу входа
        navigate('/login');
      } else {
        console.log('Ошибка при выходе', response);
        navigate('/login');
      }
    })
    .catch(error => {
      console.error('Ошибка при выходе', error);
      navigate('/login');
    });
  };
  const getUserRole = () => {
    return localStorage.getItem('role'); // Предполагается, что роль хранится в localStorage
  };
  const userRole = getUserRole();
  
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src={Logo} alt="TransAI" className={styles.logo} />
        <h1 className={styles.logoText}>TransAI</h1>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/reports" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <img className='dashboard' src={ReportIcon} alt="Дашборды" /> Отчеты
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <img className={styles.profile}   src={ProfileIcon} alt="Профиль" /> Профиль
        </NavLink>
        <NavLink to="/forecasting" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <img src={ForecastingIcon} alt="Прогнозирование" /> Прогнозирование
        </NavLink>
        <NavLink to="/data-management" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <img src={DataManagementIcon}  alt="Управление данными" /> Управление данными
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <img className={styles.analytics}   src={AnalyticsIcon}  alt="Отчеты" /> Аналитика
        </NavLink>
       {userRole==='admin'&& (<NavLink to="/users" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <img    src={ProfileIcon}  alt="ПОльзователи" /> Пользователи
        </NavLink>)}

        <NavLink className={styles.link}>
        <button onClick={handleLogout}  className={styles.btn}>
          <img src={LogoutIcon} alt="Выйти" /> Выйти
        </button>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
