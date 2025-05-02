import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <h1 className="text-xl font-bold">ScholarHub</h1>
      <div>
        <Link to="/" className="mr-4">LandingPage</Link>
        <Link to="/Scholarships" className="mr-4">Scholarships</Link>
        <Link to="/register" className="mr-4">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
