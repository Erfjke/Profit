import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';

const Layout = () => {


  return (
    
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
       <Header  /> 
        <div className={styles.content}>
        <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
