import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://127.0.0.1:8000/accounts")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAccounts(data);
        }
      })
      .catch((error) => console.error("Error fetching accounts:", error));
  }, []);
  function refreshPage() { window. location. reload(false); }

  const handleLogout = () => {
    navigate("/login");
    refreshPage()
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />

      <div className="container">
        <div className="jumbotron text-center p-5 rounded">
          <h1 className="display-4"><b>Welcome to Maverick Bank</b></h1>
          <p className="lead text-muted">
            Manage your accounts, make transactions, and view account details seamlessly.
          </p>
        </div>

        {/* Account List Table */}
        <div className="card shadow-sm mt-4">
          <div className="card-header bg-dark text-white">
            <h3 className="card-title mb-0">Bank Account List</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Account Number</th>
                    <th scope="col">Account Type</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Bank ID</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <tr key={account.account_number}>
                        <td>{account.account_number}</td>
                        <td>{account.account_type}</td>
                        <td>Rs. {account.balance}</td>
                        <td>{account.bank_id}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No accounts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;