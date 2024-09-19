import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import styles from "./authForm.module.css"; 
import { useNavigate } from 'react-router-dom';

function Reg() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userInfo.password !== userInfo.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/reg/', {
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      // Обработка ответа от сервера
      const { access, refresh, id } = response.data;
      // Сохраните токены в localStorage или в любом другом месте
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_id', id);
      localStorage.setItem('username',response.data.username)

      navigate(`/login`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      alert('Registration failed: ' + errorMessage);
    }
  };

  return (
    <div className={styles.pageContainer}>
        <div className={styles.container}>
            <h1 className={styles.title}>Регистрация</h1>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                  <label htmlFor="username" className={styles.label}>Имя пользователя</label>
                  <input type="text" id="username" name="username" value={userInfo.username} onChange={handleChange} placeholder="Введите ваше имя пользователя" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input type="email" id="email" name="email" value={userInfo.email} onChange={handleChange} placeholder="Введите ваш email" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>Пароль</label>
                  <input type="password" id="password" name="password" value={userInfo.password} onChange={handleChange} placeholder="Введите пароль" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>Подтверждение пароля</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" value={userInfo.confirmPassword} onChange={handleChange} placeholder="Подтвердите пароль" className={styles.input} />
              </div>
              <button type="submit" className={styles.button}>Зарегистрироваться</button>
            </form>
            <div className={styles.footer}>
                <p>Уже есть аккаунт? <NavLink to="/login">Войти</NavLink></p>
            </div>
        </div>
    </div>
  );
}

export default Reg;
