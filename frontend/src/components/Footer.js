import React from "react";
import "../styles/Footer.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return React.createElement(
        "footer",
        { className: "footer" },
        React.createElement(
            "div",
            { className: "footer-content" },
            // About Section
            React.createElement(
                "div",
                { className: "footer-section" },
                React.createElement("h3", null, "About ScholarHub"),
                React.createElement(
                    "p",
                    null,
                    "ScholarHub is dedicated to helping students find scholarships to fund their education."
                )
            ),
            // Quick Links Section
            React.createElement(
                "div",
                { className: "footer-section" },
                React.createElement("h3", null, "Quick Links"),
                React.createElement(
                    "ul",
                    null,
                    React.createElement("li", null, React.createElement("a", { href: "/" }, "Home")),
                    React.createElement("li", null, React.createElement("a", { href: "/about" }, "About")),
                    React.createElement("li", null, React.createElement("a", { href: "/scholarships" }, "Scholarships")),
                    React.createElement("li", null, React.createElement("a", { href: "/contact" }, "Contact"))
                )
            ),
            // Contact Section
            React.createElement(
                "div",
                { className: "footer-section" },
                React.createElement("h3", null, "Contact Us"),
                React.createElement("p", null, "Email: support@scholarhub.com"),
                React.createElement("p", null, "Phone: +1 234 567 890"),
                React.createElement("p", null, "Operating Hours: Mon-Fri, 9 AM - 5 PM")
            ),
            // Social Media Section
            React.createElement(
                "div",
                { className: "footer-section" },
                React.createElement("h3", null, "Follow Us"),
                React.createElement(
                    "div",
                    { className: "social-media" },
                    React.createElement(
                        "a",
                        { href: "https://facebook.com", target: "_blank", rel: "noopener noreferrer" },
                        React.createElement(FaFacebook, { className: "icon" })
                    ),
                    React.createElement(
                        "a",
                        { href: "https://twitter.com", target: "_blank", rel: "noopener noreferrer" },
                        React.createElement(FaTwitter, { className: "icon" })
                    ),
                    React.createElement(
                        "a",
                        { href: "https://linkedin.com", target: "_blank", rel: "noopener noreferrer" },
                        React.createElement(FaLinkedin, { className: "icon" })
                    ),
                    React.createElement(
                        "a",
                        { href: "https://instagram.com", target: "_blank", rel: "noopener noreferrer" },
                        React.createElement(FaInstagram, { className: "icon" })
                    )
                )
            )
        ),
        // Footer Bottom Section
        React.createElement(
            "div",
            { className: "footer-bottom" },
            React.createElement(
                "p",
                null,
                "© 2025 ScholarHub. All rights reserved. | ",
                React.createElement("a", { href: "/privacy-policy" }, "Privacy Policy")
            )
        )
    );
};

export default Footer;
