import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
      alert('Password reset successful!');
      navigate('/login');
    } catch (error) {
      alert('Failed to reset password.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          className="block w-full p-2 mb-3 border"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
