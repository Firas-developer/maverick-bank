import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

const Deposit = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountNumber || !amount) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.put("http://127.0.0.1:8000/deposit", {
        account_number: accountNumber,
        amount: parseFloat(amount),
      });
      setResponse(response.data);
      setError("");
    } catch (error) {
      setError("Failed to process deposit. Please check the account number and amount.");
      setResponse(null);
      console.error("Error processing deposit:", error);
    }
  };
  function refreshPage() { window. location. reload(false); }

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
            <div className="card shadow-sm bg-dark text-light border-secondary">
              <div className="card-header bg-secondary text-white">
                <h3 className="card-title text-center mb-0">Deposit Money</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Account Number Field */}
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

                  {/* Amount Field */}
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount
                    </label>
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount to deposit"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Deposit
                    </button>
                  </div>
                </form>

                {/* Error Message */}
                {error && <p className="text-danger mt-3">{error}</p>}

                {/* Success Message and Updated Account Details */}
                {response && (
                  <div className="mt-4">
                    <div className="alert alert-success" role="alert">
                      Deposit successful!
                    </div>
                    <div className="card bg-secondary text-light">
                      <div className="card-body">
                        <p><strong>Account Number:</strong> {response.account_number}</p>
                        <p><strong>New Balance:</strong> Rs. {response.new_balance}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;