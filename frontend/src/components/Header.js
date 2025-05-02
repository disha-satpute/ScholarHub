import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUserGraduate, FaUniversity, FaBook, FaInfoCircle, FaPhone, FaSteamSquare } from "react-icons/fa";
import "../styles/Header.css";
import LanguageSelector from "./LanguageSelector";
const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return React.createElement(

        React.Fragment,
        null,
        React.createElement(
            "header",
            { className: "navbar" },
            React.createElement(
                "div",
                { className: "container" },
                React.createElement(Link, { to: "/", className: "logo" }, "ScholarHub"),

                React.createElement(
                    "button",
                    { className: "menu-toggle", onClick: () => setIsSidebarOpen(true) },
                    React.createElement(FaBars, null),
                    
                )
                
            ),
            React.createElement(LanguageSelector, null), 
        ),
        React.createElement(
            "div",
            { className: `sidebar ${isSidebarOpen ? "open" : ""}` },
            React.createElement(
                "button",
                { className: "close-btn", onClick: () => setIsSidebarOpen(false) },
                React.createElement(FaTimes, null)
            ),
            React.createElement(
                "nav",
                { className: "menu" },
                React.createElement(
                    "ul",
                    null,
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            Link,
                            { to: "/", className: "menu-item" },
                            React.createElement(FaBook, null),
                            " Home"
                        )
                    ),
                   
                    React.createElement(
                        "li",
                        { className: "menu-dropdown" },
                        React.createElement("span", { className: "menu-title" }, React.createElement(FaUserGraduate, null), " Students"),
                        React.createElement(
                            "ul",
                            { className: "submenu" },
                            React.createElement("li", null, React.createElement(Link, { to: "/Register", className: "submenu-item" }, "Register")),
                            React.createElement("li", null, React.createElement(Link, { to: "/Login", className: "submenu-item" }, "Login")),
                            React.createElement("li", null, React.createElement(Link, { to: "/.", className: "submenu-item" }, ".."))
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "menu-dropdown" },
                        React.createElement("span", { className: "menu-title" }, React.createElement(FaUniversity, null), " Admin"),
                        React.createElement(
                            "ul",
                            { className: "submenu" },
                            React.createElement("li", null, React.createElement(Link, { to: "/admin-register", className: "submenu-item" }, "Admin Register")),
                            React.createElement("li", null, React.createElement(Link, { to: "/admin-login", className: "submenu-item" }, "Admin Login")),
                            React.createElement("li", null, React.createElement(Link, { to: "/guidelines", className: "submenu-item" }, "Guidelines"))
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            Link,
                            { to: "/scholarships", className: "menu-item" },
                            React.createElement(FaSteamSquare, null),
                            "Scholarships"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            Link,
                            { to: "/Contact", className: "menu-item" },
                            React.createElement(FaPhone, null),
                            "Contact"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            Link,
                            { to: "/about", className: "menu-item" },
                            React.createElement(FaInfoCircle, null),
                            " About"
                        )
                    )
                )
            )
        )
    );
    
};

export default Header;
