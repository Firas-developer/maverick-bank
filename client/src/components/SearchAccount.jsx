import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

const SearchAccount = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountData, setAccountData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!accountNumber) {
      setError("Please enter an account number.");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/account/${accountNumber}`
      );
      setAccountData(response.data);
      setError("");
    } catch (error) {
      setError("Account not found. Please check the account number.");
      setAccountData(null);
      console.error("Error fetching account data:", error);
    }
  };
  function refreshPage() { window.location.reload(false); }

  return (
    <div className="bg-dark min-vh-100">
      {/* Navbar */}
      <Navbar
        onLogout={() => {
          navigate("/login");
          refreshPage()
        }}
      />

      {/* Main Content */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            {/* Search Bar */}
            <div className="card shadow-sm bg-dark text-light border-secondary mb-4">
              <div className="card-header bg-secondary text-white">
                <h3 className="card-title text-center mb-0">Search Account</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSearch}>
                  <div className="mb-3">
                    <label htmlFor="accountNumber" className="form-label">
                      Account Number
                    </label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                  </div>
                </form>
                {error && <p className="text-danger mt-3">{error}</p>}
              </div>
            </div>

            {/* Display Account Data */}
            {accountData && (
              <div className="card shadow-sm bg-dark text-light border-secondary">
                <div className="card-header bg-secondary text-white">
                  <h3 className="card-title text-center mb-0">Account Details</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Account Number:</strong> {accountData.account_number}
                  </div>
                  <div className="mb-3">
                    <strong>Account Type:</strong> {accountData.account_type}
                  </div>
                  <div className="mb-3">
                    <strong>Balance:</strong> Rs. {accountData.balance}
                  </div>
                  <div className="mb-3">
                    <strong>Bank ID:</strong> {accountData.bank_id}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAccount;