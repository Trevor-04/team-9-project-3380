import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function DonatePage() {
    const [formData, setFormData] = useState({
        donationAmount: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        email: "",
        phone: "",
        cardNumber: "",
        expDate: "",
        cvv: "",
    });

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmitForm = async (formData) => { 
        const newDonation ={
           amount: formData.donationAmount,
           firstName: formData.firstName,
           lastName: formData.lastName,
           address: formData.address,
           city: formData.city,
           state: formData.state,
           zip: formData.zip,
           email: formData.email,
           phone: formData.phone,
          } 

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/donations/add`, newDonation);
            console.log('Response from backend:', response);
            alert("Donation successful!");
        } catch (error) {
            console.error("Error during checkout:", error.response ? error.response.data : error);
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
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-6 text-center">Donation Checkout</h2>
                    <input
                        type="text"
                        name="donationAmount"
                        placeholder="$ Donation Amount"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.donationAmount}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.state}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="zip"
                        placeholder="Zip"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.zip}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.cardNumber}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="expDate"
                        placeholder="Expiration Date"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        required
                        value={formData.expDate}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        className="p-2 border border-[#165e229e] w-full rounded mt-4"
                        value={formData.cvv}
                        onChange={handleChange}
                    />

                    <Link to="/">
                        <button className="bg-[#165e229e] text-white font-extrabold w-[100px] h-[40px] mt-4 rounded-full">
                            Go Back
                        </button>
                    </Link>

                    <button
                        type="submit"
                        className="bg-[#165e229e] text-white font-extrabold w-[100px] h-[40px] mt-4 ml-8 rounded-full"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DonatePage;
