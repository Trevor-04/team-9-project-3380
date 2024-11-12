import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
//import './payment.css'; // Optional if you want to add custom styles beyond Tailwind

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { memberId } = useParams(); // Get memberId from the URL
  const {
    selectedTime,
    selectedDate,
    adultTickets,
    childTickets,
    seniorTickets,
    infantTickets,
    finalPrice,
  } = location.state || {};

  const [email, setEmail] = useState('');

  const handleBackToTimeSlot = () => {
    navigate('/tickets');
  };

  const handleSubmit = () => {
    // // Handle payment submission logic here
    // navigate('/confirmation', { state: { selectedTime, selectedDate, finalPrice, email } });
    alert('Payment successful');
    console.log(memberId);
    if(memberId === 'undefined')
      navigate(`/`);
    else
      navigate(`/member/${memberId}`); // Redirect back to MemberPage with dynamic memberId
  };

  return (
    <div className="w-4/5 max-w-lg mx-auto mt-12 p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Payment Page</h2>

      <div className="mb-6">
        <p className="text-gray-600 text-lg mb-2"><strong>Selected Time:</strong> {selectedTime}</p>
        <p className="text-gray-600 text-lg mb-2"><strong>Selected Date:</strong> {selectedDate}</p>
        <p className="text-gray-600 text-lg mb-2"><strong>Adult Tickets:</strong> {adultTickets}</p>
        <p className="text-gray-600 text-lg mb-2"><strong>Child Tickets:</strong> {childTickets}</p>
        <p className="text-gray-600 text-lg mb-2"><strong>Senior Tickets:</strong> {seniorTickets}</p>
        <p className="text-gray-600 text-lg mb-2"><strong>Infant Tickets:</strong> {infantTickets}</p>
        <p className="text-gray-600 text-lg mb-2"><strong>Final Price:</strong> ${finalPrice}</p>
      </div>

      <div className="mb-6 w-full">
        <label htmlFor="email" className="block text-gray-700 text-lg mb-2">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex justify-between w-full mt-6 gap-6">
        <button
          className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          onClick={handleBackToTimeSlot}
        >
          Back to Select Time Slot
        </button>
        <button
          className="flex-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={handleSubmit}
        >
          Submit Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;