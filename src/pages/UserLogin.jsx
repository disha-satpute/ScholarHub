import React from 'react';
import '../styles/UserLogin.css';

const UserLogin = 
() => {
    return (
        <div className="user-login">
            <h2>User Login/Register</h2>
            <form>
                <input type="text" placeholder="Username" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="#">Register</a></p>
            </form>
        </div>
    );
};

export default UserLogin;