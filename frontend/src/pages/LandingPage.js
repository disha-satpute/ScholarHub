
import React, { useEffect, useState } from "react";
import "../styles/LandingPage.css";

const images = [
  "/img/a.jpeg", "/img/b.jpeg", "/img/c.jpeg", "/img/d.jpeg", "/img/e.jpeg",
  "/img/f.jpeg", "/img/g.jpg", "/img/h.jpeg", "/img/i.jpeg",
];

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="landing-page">
      {/* 🔄 Background Slideshow */}
      <div className="slideshow">
        {images.map((img, index) => (
         <img
         key={index}
         src={img}
         alt={`Slide ${index + 1}`}
         className={
           index === currentIndex
             ? "active"
             : index === (currentIndex - 1 + images.length) % images.length
             ? "prev"
             : ""
         }
       />
       
        ))}
        <div className="slideshow-overlay" />
      </div>

      {/* 🏆 Hero Section */}
      <section className="hero fade-in">
        <h1>Welcome to <span className="highlight">ScholarHub</span></h1>
        <p>Your gateway to <strong>government and private scholarships</strong></p>
        <div className="cta-buttons">
        <a href="/scholarships" className="cta-btn-link">
  <button className="cta-btn">Explore Now</button>
  </a>
  <a href="/register" className="cta-btn-link">
    <button className="cta-btn">Sign Up</button>
  </a>
</div>

      </section>

      <section className="about-section fade-in">
  <h3>📌 About the Portal</h3><br></br>
  <p className="about-description">
    <strong>ScholarHub</strong> is a centralized platform designed to streamline access to scholarships across India. 
    Whether you're a student, an educational institution, or a government body, ScholarHub provides a unified gateway 
    for discovering, applying, managing scholarship opportunities.
  </p>

  <div className="about-features">
    <div className="feature-card">
      🎯 <strong>Find Scholarships Easily</strong>
      <p>Search and filter scholarships based on your eligibility—state, caste, education level, income, and more.</p>
    </div>
    <div className="feature-card">
      📝 <strong>Apply with Confidence</strong>
      <p>Apply directly on the platform with real-time eligibility verification and document upload support.</p>
    </div>
    <div className="feature-card">
      🔐 <strong>Track Application Status</strong>
      <p>Stay informed with live status updates, SMS/email notifications, and downloadable receipts.</p>
    </div>
    <div className="feature-card">
      🗃️ <strong>Centralized Dashboard</strong>
      <p>Get a full view of saved, ongoing, and completed applications in one clean dashboard interface.</p>
    </div>
  </div>
</section>

      {/* 🧩 Services Section */}
      <section className="services-section fade-in">
    
        <h2>🛠️ Our Services</h2>
        <div className="service-grid">
          <div className="service-card">Students</div>
          <div className="service-card">Institutes</div>
          <div className="service-card">Nodal Officers</div>
          <div className="service-card">Reports</div>
        </div>
      </section>

      {/* 📢 Notices Section */}
      <section className="notices-section slide-up">
        <h2>📰 Latest Notices</h2>
        <ul>
          <li>📌 National Scholarship registration opens from <strong>July 1, 2025</strong></li>
          <li>📌 Deadline extended for Minority Scholarship - <strong>Aug 15</strong></li>
          <li>📌 Platform maintenance on <strong>June 10</strong></li>
        </ul>
      </section>

      {/* 🔗 Important Links */}
      <section className="links-section fade-in">
        <h2>🔗 Quick Links</h2>
        <ul>
          <li><a href="/">📘 User Manual</a></li>
          <li><a href="/">❓ FAQs</a></li>
          <li><a href="/">📞 Contact Us</a></li>
        </ul>
      </section>

      {/* 🧭 Footer */}
      <footer className="footer">
        <p>© 2025 <strong>ScholarHub</strong> | Designed to empower your scholarship journey 🚀</p>
      </footer>
    </main>
  );
};

export default LandingPage;