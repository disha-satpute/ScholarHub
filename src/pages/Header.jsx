import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showAdminDropdown, setShowAdminDropdown] = useState(false);

    return (
        <header>
            <div className="logo">ScholarHub</div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/scholarships">Scholarships</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li
                        onMouseEnter={() => setShowUserDropdown(true)}
                        onMouseLeave={() => setShowUserDropdown(false)}
                    >
                        <span>User Login/Register</span>
                        {showUserDropdown && (
                            <div className="dropdown">
                                <Link to="/user-login">Login</Link>
                                <Link to="/user-register">Register</Link>
                            </div>
                        )}
                    </li>
                    <li
                        onMouseEnter={() => setShowAdminDropdown(true)}
                        onMouseLeave={() => setShowAdminDropdown(false)}
                    >
                        <span>Admin Login/Register</span>
                        {showAdminDropdown && (
                            <div className="dropdown">
                                <Link to="/admin-login">Login</Link>
                                <Link to="/admin-register">Register</Link>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;