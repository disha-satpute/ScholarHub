import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    return (
        <header>
            <div className="logo">ScholarHub</div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/scholarships">Scholarships</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/user-login">User  Login/Register</Link></li>
                    <li><Link to="/admin-login">Admin Login/Register</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;