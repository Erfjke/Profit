import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.css';

function Profile() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Получение данных пользователя при загрузке компонента
    axios.get('http://localhost:8000/api/profile/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => {
      setUserData({ ...response.data, password: '*****' });
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSave = () => {
    axios.patch('http://localhost:8000/api/profile/', userData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setUserData({ ...response.data, password: '*****' });
      setIsEditing(false);
    })
    .catch(error => {
      console.error('Error saving profile data:', error);
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Личная информация</h1>
      <div className={styles.infoGroup}>
        <label className={styles.label}>Логин</label>
        <input
          type="text"
          name="username"
          className={styles.input}
          value={userData.username}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </div>
      <div className={styles.infoGroup}>
        <label className={styles.label}>Пароль</label>
        <input
          type="password"
          name="password"
          className={styles.input}
          value={userData.password}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </div>
      <div className={styles.infoGroup}>
        <label className={styles.label}>Электронная почта</label>
        <input
          type="email"
          name="email"
          className={styles.input}
          value={userData.email}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </div>
      {isEditing ? (
        <button className={styles.button} onClick={handleSave}>Сохранить</button>
      ) : (
        <button className={styles.button} onClick={() => setIsEditing(true)}>Изменить данные</button>
      )}
    </div>
  );
}

export default Profile;
