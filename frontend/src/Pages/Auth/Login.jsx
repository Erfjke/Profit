import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Импорт NavLink из react-router-dom
import axios from 'axios';
import styles from "./authForm.module.css";
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      axios.post(
        'http://localhost:8000/api/login/',
        { username, password },
      )
      .then(response => {
        if (response.status !== 200) return;
        console.log(Boolean(localStorage.getItem("access_token") ))
        console.log((localStorage.getItem("role") ))
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('id',response.data.id);
        localStorage.setItem('username',response.data.username);
        localStorage.setItem('role',response.data.role)
        console.log(Boolean(localStorage.getItem("access_token") ))
        console.log((localStorage.getItem("role") ))
        navigate(`/profile`);
        // window.location.reload();
      })
      .catch(error => {
        console.log(error.response.status);
        if (error.response.status === 403) {
          setErrorMessage('Ваш аккаунт деактивирован. Пожалуйста, свяжитесь с поддержкой.');
        } else {
          console.error('Ошибка при авторизации:', error);
          setErrorMessage('Неверный логин или пароль');
        }
      });
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      setErrorMessage('Неверный логин или пароль');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>Вход</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Введите имя пользователя"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Введите пароль"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.button}>Войти</button>
        </form>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <div className={styles.footer}>
          <p>Нет аккаунта? <NavLink to="/reg" className={styles.link}>Зарегистрироваться</NavLink></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
