import { useState } from 'react';
import axios from 'axios';
import '../styles/UserLogin.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
      setMessage('Password reset instructions sent to your email.');
    } catch (error) {
      setMessage('Error sending reset instructions. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="login-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Reset Password</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
