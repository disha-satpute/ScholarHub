import React, { useEffect, useState } from "react";
import "../styles/LandingPage.css";

const images = [
    "https://source.unsplash.com/1600x900/?education,books",
    "https://source.unsplash.com/1600x900/?students,learning",
    "https://source.unsplash.com/1600x900/?university,classroom",
    "https://source.unsplash.com/1600x900/?library,study"
];

const LandingPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000); // Change image every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="landing-page">
            {/* 🔄 Background Slideshow */}
            <div className="slideshow">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className={index === currentIndex ? "active" : ""}
                    />
                ))}
            </div>

            {/* 📌 Dark Overlay */}
            <div className="slideshow-overlay"></div>

            {/* 🏆 Hero Section */}
            <div className="hero">
                <h1>Welcome to ScholarHub</h1>
                <p>Find the perfect scholarship to achieve your dreams</p>
                <button className="cta-btn">Explore Scholarships</button>
            </div>
        </div>
    );
};

export default LandingPage;
