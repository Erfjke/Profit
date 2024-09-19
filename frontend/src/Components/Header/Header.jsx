import React ,{useEffect, useState} from 'react';
import styles from './Header.module.css';
import ProfileImage from '../../images/profile.png'; 
import { useLocation,NavLink } from 'react-router-dom';

const Header = () => {
 

  const location = useLocation();
  
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Получение значения username из localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); // Пустой

  // Определяем заголовок в зависимости от пути
  const getTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Главная';
      case '/reg':
        return 'Регистрация';
      case '/login':
        return 'Вход';
      case '/data-management':
        return 'Управление данными';
      case '/profile':
        return 'Профиль';
      case '/forecasting':
        return 'Прогнозирование';
      case '/analytics':
        return 'Аналитика';
      case '/reports':
        return 'Отчеты';
      default:
        return 'Главная';
    }
  };


  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h1>{getTitle(location.pathname)}</h1>
      </div>
   
      <div className={styles.profile}>
        <NavLink to="/profile">
          <img src={ProfileImage} alt="Profile" className={styles.profileImage} />
        </NavLink>
        <div className={styles.profileText}>
          <span className={styles.profileName}>{username}</span>
          <span className={styles.profileRole}>Пользователь</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
