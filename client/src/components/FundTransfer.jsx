import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Card, Table } from "react-bootstrap";
import Navbar from "./Navbar";

const FundTransfer = () => {
    const [formData, setFormData] = useState({
        sender_account: "",
        receiver_account: "",
        amount: "",
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [updatedSender, setUpdatedSender] = useState(null);
    const [updatedReceiver, setUpdatedReceiver] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setUpdatedSender(null);
        setUpdatedReceiver(null);

        try {
            const response = await axios.post("http://127.0.0.1:8000/transfer/", formData);

            // Extract response data
            setMessage(response.data.message);
            setUpdatedSender(response.data.sender_account);
            setUpdatedReceiver(response.data.receiver_account);
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred.");
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
            <Container className="py-5">
                <Card className="p-4 bg-dark text-light border-secondary shadow-lg">
                    <h2 className="text-center mb-4">Fund Transfer</h2>

                    {/* Form */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Sender Account Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="sender_account"
                                value={formData.sender_account}
                                onChange={handleChange}
                                required
                                placeholder="Enter Sender Account Number"
                                className="bg-dark text-light border-secondary"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Receiver Account Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="receiver_account"
                                value={formData.receiver_account}
                                onChange={handleChange}
                                required
                                placeholder="Enter Receiver Account Number"
                                className="bg-dark text-light border-secondary"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                placeholder="Enter Amount"
                                className="bg-dark text-light border-secondary"
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            style={{ backgroundColor: "#6c5ce7", border: "none" }}
                        >
                            Transfer Funds
                        </Button>
                    </Form>

                    {/* Success Message */}
                    {message && <Alert variant="success" className="mt-3">{message}</Alert>}

                    {/* Error Message */}
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                    {/* Updated Account Details */}
                    {updatedSender && updatedReceiver && (
                        <Card className="p-3 mt-4 bg-dark text-light border-secondary">
                            <h5 className="text-center">Updated Account Details</h5>
                            <Table striped bordered hover variant="dark" className="mt-2">
                                <thead>
                                    <tr>
                                        <th>Account Number</th>
                                        <th>Remaining Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{updatedSender.account_number}</td>
                                        <td>₹{updatedSender.remaining_balance}</td>
                                    </tr>
                                    <tr>
                                        <td>{updatedReceiver.account_number}</td>
                                        <td>₹{updatedReceiver.updated_balance}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default FundTransfer;
