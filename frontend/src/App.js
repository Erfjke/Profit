
import React from 'react';
import HomePage from "./Pages/MainPage/HomePage.jsx";
import RegisterPage from './Pages/Auth/Reg.jsx';
import LoginPage from './Pages/Auth/Login.jsx';
import Layout from './Components/Layout/Layout.jsx';
// import Dashboard from './pages/Dashboard';
import Profile from './Pages/Profile/Profile.jsx';
// import Forecasting from './pages/Forecasting';
import DataManagement from './Pages/DataManagement/DataManagement.jsx';
// import Analytics from './pages/Analytics';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './Components/PrivateRoute.jsx';
import ForecastingPage from './Pages/Forecasting/ForecastingPage.jsx';
import Analytics from './Pages/Analytics/Analytics.jsx';
import Report from './Pages/Reports/Report.jsx';
import AdminPage from './Pages/AdminPage/Admin.jsx';
function App() {

  const getUserRole = () => {
    return localStorage.getItem('role'); // Предполагается, что роль хранится в localStorage
  };
  const userRole = getUserRole();
  return (
    <div>
    <Router>
        <Routes>
            <Route path="/" element={<HomePage/>}></Route>
            <Route path="/reg" element={<RegisterPage/>}></Route>
            <Route path="/login" element={<LoginPage/>}></Route>
            
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              {/* <Route path="/profile" element={<Profile />} /> */}
              {/* <Route path="/forecasting" element={<Forecasting />} /> */}
              <Route element={<PrivateRoute/>}>
                <Route element={ <Layout />}>
                  <Route path="/data-management" element={<DataManagement/>} />
                  <Route path="/profile" element={<Profile/>} />
                  <Route path="/forecasting" element={<ForecastingPage/>} />
                  <Route path="/analytics" element={<Analytics/>} />
                  <Route path="/reports" element={<Report/>} />
                  <Route path="/users" Component={AdminPage} />
                </Route>
              </Route>
              {/* <Route path="/analytics" element={<Analytics />} /> */}
        
       </Routes>
   
    </Router>
</div>
  );
}

export default App;
