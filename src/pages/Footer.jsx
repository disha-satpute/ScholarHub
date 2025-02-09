import React from 'react';
import '../styles/Footer.css';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>About ScholarHub</h3>
                    <p>ScholarHub is dedicated to helping students find scholarships to fund their education.</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/scholarships">Scholarships</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: support@scholarhub.com</p>
                    <p>Phone: +1 234 567 890</p>
                    <p>Operating Hours: Mon-Fri, 9 AM - 5 PM</p>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                   <div className="social-media">
                                           <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                               <FaFacebook className="icon" /> {/* Facebook Icon */}
                                           </a>
                                           <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                               <FaTwitter className="icon" /> {/* Twitter Icon */}
                                           </a>
                                           <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                               <FaLinkedin className="icon" /> {/* LinkedIn Icon */}
                                           </a>
                                           <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                               <FaInstagram className="icon" /> {/* Instagram Icon */}
                                           </a>
                                       </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 ScholarHub. All rights reserved. | <a href="/privacy-policy">Privacy Policy</a></p>
            </div>
        </footer>
    );
};

export default Footer;