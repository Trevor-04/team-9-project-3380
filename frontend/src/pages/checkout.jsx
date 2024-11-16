import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Checkout() {
    const location = useLocation();
    const [role, setRole] = useState(null);
    const [isMember, setIsMember] = useState(false); // Initialize as false initially
    const membershipType = location.state?.membershipType || "No membership selected";
    const amount = location.state?.amount || "No amount selected";

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Retrieved Token:", token); // Log the token itself
    
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken); // Log the entire decoded token
    
                if (decodedToken && decodedToken.role) {
                    setRole(decodedToken.role); // Set role from the token
                    if (decodedToken.role === "member") { // Check if the decoded role is 'member'
                        setIsMember(true); // Set isMember to true if role is 'member'
                    }
                } else {
                    console.error("Role not found in decoded token");
                    setIsMember(false); // Set false if role is not present
                }
            } catch (error) {
                console.error("Failed to decode token:", error);
                setIsMember(false); // Set false if there's a decoding error
            }
        } else {
            setIsMember(false); // Set false if no token is found
        }
    }, []); // Empty dependency array ensures this effect runs once when component mounts
    

    const [formData, setFormData] = useState({
        membershipType: membershipType,
        amount: amount,
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        phone: '',
        email: '',
        ccNumber: '',
        expDate: '',
        cvv: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitForm = async (formData) => {
        // Here, you would perform form validation and membership status check
        if (!isMember) {
            alert("Please sign up for a membership to proceed.");
            return;
        }

        const newPlan = {
            membershipType: formData.membershipType,
            amount: formData.amount,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zip: formData.zip,
            phone: formData.phone,
            email: formData.email,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/memberPlans/add`, newPlan);
            console.log('Response from backend:', response);
            alert("Membership successful!");

            setFormData({
                firstName: '',
                lastName: '',
                address: '',
                city: '',
                state: '',
                country: '',
                zip: '',
                phone: '',
                email: '',
                ccNumber: '',
                expDate: '',
                cvv: ''
            });

        } catch (error) {
            console.error("Error during checkout:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitForm(formData);
    };

    return (
        <div className="bg-[#fef7e7] min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Membership Checkout</h2>
                <p className="text-center text-lg font-semibold mb-4">{membershipType} Selected</p>

                {!isMember ? (
                    <Link to="/signup">
                    <p className="text-red-500 text-center mb-4">
                        You need to <a className="text-blue-500 underline">sign up</a> to proceed with checkout.
                    </p>
                    </Link>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <select
                            name="membershipType"
                            value={formData.membershipType}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        >
                            <option value="bronze">Bronze</option>
                            <option value="silver">Silver</option>
                            <option value="gold">Gold</option>
                            <option value="platinum">Platinum</option>
                            <option value="diamond">Diamond</option>
                        </select>

                        <input 
                            type="text" 
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        />
                        <input 
                            type="text" 
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        />
                        <input 
                            type="text" 
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        />
                        <input 
                            type="text" 
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        />
                        <input 
                            type="text" 
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        />
                        <input 
                            type="text" 
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        />
                        <input 
                            type="text" 
                            name="zip"
                            placeholder="Zip Code"
                            value={formData.zip}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        />
                        {/* Credit Card Information */}
                        <input 
                            type="text" 
                            name="ccNumber"
                            placeholder="Credit Card Number"
                            value={formData.ccNumber}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            maxLength="16"
                            required
                        />
                        <div className="flex space-x-4">
                            <input 
                                type="text" 
                                name="expDate"
                                placeholder="MM/YY"
                                value={formData.expDate}
                                onChange={handleChange}
                                className="p-2 border border-[#165e229e] rounded w-1/2"
                                maxLength="5"
                                required
                            />
                            <input 
                                type="text" 
                                name="cvv"
                                placeholder="CVV"
                                value={formData.cvv}
                                onChange={handleChange}
                                className="p-2 border border-[#165e229e] rounded w-1/2"
                                maxLength="3"
                                required
                            />
                        </div>

                        <input 
                            type="tel" 
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        />
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-2 border border-[#165e229e] rounded"
                            required
                        />

                        <button 
                            type="submit"
                            className="bg-[#165e229e] text-white p-2 rounded font-bold mt-4"
                        >
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Checkout;