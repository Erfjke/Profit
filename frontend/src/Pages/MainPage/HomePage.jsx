import React from 'react';
import styles from './HomePage.module.css'; // Импортируем файл стилей
import HandShake from '../../images/handshake.png';
import Research from '../../images/data-research.png';
import Truck from '../../images/truck.png';
import Logo from '../../images/Logo.png'; // Добавляем импорт логотипа
import { NavLink } from 'react-router-dom';
const HomePage = () => {
    return (
        <div className={styles.homepage}>
            <header className={styles.header}>
                <div className={styles.topNav}>
                    <div className={styles.logoContainer}>
                        <img src={Logo} alt="Логотип" className={styles.logoImage} />
                        <div className={styles.logoText}>TransAI</div>
                    </div>
                    <div >
                    <NavLink to="/login" className={styles.authLinks} >Вход</NavLink>
                    <NavLink to="/reg" className={styles.authLinks}>Регистрация</NavLink>
                    </div>
                </div>
                <div className={styles.heroSection}>
                    <h1>Платформа для прогнозирования рентабельности</h1>
                    <p>Экосистема сервисов для транспортной логистики</p>
                    <p>Прогнозирование | Рентабельность | TMS | Трекинг перевозок</p>
                    <NavLink to="/login"  >
                        <button className={styles.tryBtn}>Попробовать </button>
                    </NavLink>
                </div>
            </header>
            <div className={styles.cardsContainer}>
                <div className={styles.infoSection}>
                    <div className={styles.infoCard}>
                        <img src={HandShake} alt="Перевозки" className={styles.cardImage}/>
                        <p className={styles.infoCardP}>Более 6 000 перевозчиков уже работают с нами</p>
                    </div>
                    <div className={styles.infoCard}>
                        <img src={Research} alt="Прогноз" className={styles.cardImage}/>
                        <p className={styles.infoCardP}>Прогнозируем свыше 100 000 перевозок в год</p>
                    </div>
                    <div className={styles.infoCard}>
                        <img src={Truck} alt="Система" className={styles.cardImage}/>
                        <p className={styles.infoCardP}>Своя система подсчета рентабельности</p>
                    </div>
                </div>
                <div className={styles.grayLine}></div>
            </div>
        </div>
    );
};

export default HomePage;
