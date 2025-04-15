import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const menuItems = [
        { name: "Dashboard", link: "/dashboard" },
        { name: "Create Account", link: "/create-account" },
        { name: "Search Account", link: "/search-account" },
        { name: "Deposit", link: "/deposit" },
        { name: "Withdraw", link: "/withdraw" },
        { name: "Fund Transfer", link: "/fund-transfer"},
        { name: "Sorted List", link: "/sorted-list" },
    ];
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-gradient shadow-sm" style={{ backgroundColor: "#2c3e50" }}>
            <div className="container-fluid">
                {/* Brand Logo */}
                <a className="navbar-brand fw-bold" href="#">
                    Maverick Bank
                </a>

                {/* Toggle Button for Mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Items */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {menuItems.map((item) => (
                            <li className="nav-item mx-2" key={item.name}>
                                <a
                                    className={`nav-link ${activeTab === item.name ? "active fw-bold" : ""
                                        } hover-effect`}
                                    onClick={() => {
                                        setActiveTab(item.name);
                                        navigate(item.link);
                                    }}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Logout Button */}
                    <button
                        className="btn btn-outline-light btn-sm fw-bold"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Custom CSS for Hover Effect */}
            <style>
                {`
          .hover-effect:hover {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            transition: background-color 0.3s ease;
          }
          .navbar {
            background: linear-gradient(135deg, #2c3e50, #34495e);
          }
        `}
            </style>
        </nav>
    );
};

export default Navbar;