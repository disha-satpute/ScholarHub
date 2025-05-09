import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"; // Import icons
import "../styles/Contact.css";

const Contact = () => {
    return (
        <div className="contact">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you! Reach out for any inquiries or support.</p>
            <div className="contact-container">
                <form className="contact-form">
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <input type="tel" placeholder="Your Phone Number (Optional)" />
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
                <div className="contact-info">
                    <h2>Contact Information</h2>
                    <p>Email: support@scholarhub.com</p>
                    <p>Phone: +917666648045</p>
                    <p>Operating Hours: Mon-Fri, 9 AM - 5 PM</p>
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
            <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <p>
                    Check out our <a href="/faq">FAQ page</a> for quick answers.
                </p>
            </div>
            <p className="privacy-policy">
                Your privacy is important to us. Read our{" "}
                <a href="/privacy-policy">Privacy Policy</a>.
            </p>
        </div>
    );
};

export default Contact;
