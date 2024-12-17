import React from 'react';
import { Route, Routes } from 'react-router-dom'; // No Router import here
import Header from './pages/Header';
import LandingPage from './pages/LandingPage';
import About from './pages//About';
import Scholarships from './pages/Scholarships';
import Contact from './pages/Contact';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import './styles/App.css';

const App = () => {
    return (
        <>
            <Header />
            <Routes> {/* Use Routes for defining routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/user-login" element={<UserLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
        </>
    );
};

export default App;