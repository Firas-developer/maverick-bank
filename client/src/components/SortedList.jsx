import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

const SortedList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/accounts/sorted");
        if (Array.isArray(response.data)) {
          setAccounts(response.data);
        } else {
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        setError("Failed to fetch account data. Please try again later.");
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

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
          <div className="col-md-10">
            <div className="card shadow-sm bg-dark text-light border-secondary">
              <div className="card-header bg-secondary text-white">
                <h3 className="card-title text-center mb-0">Sorted List of Bank Accounts</h3>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : error ? (
                  <p className="text-danger text-center">{error}</p>
                ) : accounts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-dark table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Account Number</th>
                          <th>Account Type</th>
                          <th>Balance</th>
                          <th>Bank ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((account) => (
                          <tr key={account.account_number}>
                            <td>{account.account_number}</td>
                            <td>{account.account_type}</td>
                            <td>Rs. {account.balance}</td>
                            <td>{account.bank_id}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center">No accounts found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortedList;