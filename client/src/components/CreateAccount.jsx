import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import axios from "axios";


const CreateAccount = () => {
  const [accountType, setAccountType] = useState("");
  const [balance, setBalance] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (balance < 0) {
      toast.error("Balance cannot be negative!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/create-account", {
        account_type: accountType,
        balance: parseFloat(balance),
      });

      toast.success("Account created successfully! 🎉");
      setTimeout(() => navigate("/dashboard"), 2000);
      // Reset form
      setAccountType("");
      setBalance("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Required minimum balance Rs. 100 to create account");
      console.error(error);
    }
  };

  return (
    <div className="bg-dark min-vh-100">
      {/* Navbar */}
      <Navbar
        onLogout={() => {
          navigate("/login");
          window.location.reload(false);
        }}
      />

      {/* Main Content */}
      <div className="container mt-5">
        <ToastContainer/>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm bg-dark text-light border-secondary">
              <div className="card-header bg-secondary text-white">
                <h3 className="card-title text-center mb-0">Create New Account</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Account Type Field */}
                  <div className="mb-3">
                    <label htmlFor="accountType" className="form-label">
                      Account Type
                    </label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      id="accountType"
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Account Type
                      </option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>

                  {/* Balance Field */}
                  <div className="mb-3">
                    <label htmlFor="balance" className="form-label">
                      Balance
                    </label>
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      id="balance"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="Enter initial balance"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;