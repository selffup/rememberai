import React, { useState } from 'react';
import { paymentAPI } from '../services/api'; // Import the payment API

const PaymentPage = () => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('INR'); // Default currency
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card'); // Default payment method

    // Add new states for card details
    const [cardNumber, setCardNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [processing, setProcessing] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await paymentAPI.createOrder(amount, currency);
            
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: response.amount,
                currency: response.currency,
                name: "Your Company Name",
                description: "Payment Transaction",
                order_id: response.id,
                handler: function (response) {
                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                },
                prefill: {
                    name: accountHolderName,
                    email: email,
                },
                theme: {
                    color: "#F37254"
                }
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
        } catch (error) {
            console.error('Error:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    // Card number formatter
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg flex">
                <div className="w-full p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Make a Payment</h2>
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                            <label htmlFor="amount" className="form-label">Amount (in INR)</label>
                            <input
                                id="amount"
                                type="number"
                                required
                                className="input-field mt-1"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="currency" className="form-label">Currency</label>
                            <select
                                id="currency"
                                className="input-field mt-1"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                {/* Add more currencies as needed */}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Payment Method</label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="card"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-2"
                                />
                                <label htmlFor="card" className="mr-4">Card</label>
                                <input
                                    type="radio"
                                    id="upi"
                                    name="paymentMethod"
                                    value="upi"
                                    checked={paymentMethod === 'upi'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-2"
                                />
                                <label htmlFor="upi">UPI</label>
                            </div>
                        </div>
                        {paymentMethod === 'card' && (
                            <div>
                                <label htmlFor="accountHolderName" className="form-label">Account Holder Name</label>
                                <input
                                    id="accountHolderName"
                                    type="text"
                                    required
                                    className="input-field mt-1"
                                    placeholder="Enter account holder name"
                                    value={accountHolderName}
                                    onChange={(e) => setAccountHolderName(e.target.value)}
                                />
                            </div>
                        )}
                        {paymentMethod === 'upi' && (
                            <div>
                                <label htmlFor="accountNumber" className="form-label">UPI ID</label>
                                <input
                                    id="accountNumber"
                                    type="text"
                                    required
                                    className="input-field mt-1"
                                    placeholder="Enter UPI ID"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                />
                            </div>
                        )}
                        {paymentMethod === 'card' && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="cardNumber" className="form-label">Card Number</label>
                                    <input
                                        id="cardNumber"
                                        type="text"
                                        required
                                        className="input-field mt-1"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        maxLength="19"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="expiryMonth" className="form-label">Month</label>
                                        <input
                                            id="expiryMonth"
                                            type="text"
                                            required
                                            className="input-field mt-1"
                                            placeholder="MM"
                                            value={expiryMonth}
                                            onChange={(e) => setExpiryMonth(e.target.value)}
                                            maxLength="2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="expiryYear" className="form-label">Year</label>
                                        <input
                                            id="expiryYear"
                                            type="text"
                                            required
                                            className="input-field mt-1"
                                            placeholder="YY"
                                            value={expiryYear}
                                            onChange={(e) => setExpiryYear(e.target.value)}
                                            maxLength="2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cvv" className="form-label">CVV</label>
                                        <input
                                            id="cvv"
                                            type="password"
                                            required
                                            className="input-field mt-1"
                                            placeholder="123"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            maxLength="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="input-field mt-1"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn-primary w-full mt-4"
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : 'Pay Now'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;