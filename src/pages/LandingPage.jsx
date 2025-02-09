import React from 'react';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <h1>Find Your Perfect Scholarship Today!</h1>
                <p>Search and apply for scholarships that match your profile.</p>
                <div>
                    <input type="text" placeholder="Search by caste, state, degree..." />
                    <button>Search</button>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="feature">
                    <h2>Wide Range of Scholarships</h2>
                    <p>Explore various scholarships available for different categories.</p>
                </div>
                <div className="feature">
                    <h2>Easy Search Filters</h2>
                    <p>Use our filters to find scholarships that suit your needs.</p>
                </div>
                <div className="feature">
                    <h2>User-Friendly Interface</h2>
                    <p>Navigate easily through our website to find the information you need.</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;