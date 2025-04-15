import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container-fluid bg-dark vh-100 d-flex flex-column align-items-center justify-content-center text-center">
      {/* Heading */}
      <h1 className="display-4 fw-bold text-light">Maverick Bank</h1>

      {/* Subheading */}
      <p className="lead text-light">Secure and Reliable Banking Services</p>

      {/* Buttons */}
      <div className="mt-4">
        <Link to="/login">
          <button className="btn btn-outline-light me-2">Login</button>
        </Link>
        <Link to="/signup">
          <button className="btn btn-primary">Signup</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;