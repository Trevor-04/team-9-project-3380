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

    const membershipAmounts = {
        bronze: 99,
        silver: 149,
        gold: 199,
        platinum: 299,
        diamond: 399
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
    
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

        // Update the amount when the membership type changes
        if (name === 'membershipType') {
            const updatedAmount = membershipAmounts[value] || 0;
            setFormData((prevData) => ({
                ...prevData,
                amount: updatedAmount
            }));
        }
    };

    const handleSubmitForm = async (formData) => {
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
                            <option value="bronze">Bronze - $99</option>
                            <option value="silver">Silver - $149</option>
                            <option value="gold">Gold - $199</option>
                            <option value="platinum">Platinum - $299</option>
                            <option value="diamond">Diamond - $399</option>
                        </select>

                        {/* Display the selected membership type and amount */}
                        <p className="text-center text-lg font-semibold mb-4">
                            You selected the {formData.membershipType.charAt(0).toUpperCase() + formData.membershipType.slice(1)} membership, priced at ${formData.amount}.
                        </p>

                        {/* Other input fields here... */}

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
