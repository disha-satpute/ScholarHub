import React from 'react';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
    return (
        <div className="admin-login">
            <h2>Admin Login/Register</h2>
            <form>
                <input type="text" placeholder="Admin Username" required />
                <input type="password" placeholder="Admin Password" required />
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="#">Register</a></p>
            </form>
        </div>
    );
};

export default AdminLogin;