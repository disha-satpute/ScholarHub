import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Scholarships from './pages/Scholarships';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AddScholarship from './pages/AddScholarship';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import ScholarshipDetails from './pages/ScholarshipDetails';
import Details from './pages/Details';
import UpdateScholarship from './pages/UpdateScholarship';
function App() {
  return (
    <Router>
      <Header/>

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />


        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />

        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/add-scholarship" element={<AddScholarship />} />

        <Route path="/scholarship-details/:id" element={<ScholarshipDetails />} />
        <Route path="/scholarship-sdetails/:id" element={<Details />} />
        <Route path="/update-scholarship/:id" element={<UpdateScholarship />} />

        </Routes>
      <Footer/>
    </Router>
  );
}
export default App;
