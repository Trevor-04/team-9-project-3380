import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { memberId } = useParams();
  const { employeeID } = useParams();
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
    if(location.pathname.startsWith('/member'))
      navigate(`/member/${memberId}/tickets`)
    else if(location.pathname.startsWith('/Admin'))
      navigate(`/Admin/${employeeID}/tickets`)
    else navigate('/tickets');
  };

  const handleSubmit = () => {
    alert('Payment successful');
    if(location.pathname.startsWith('/member'))
      navigate(`/member/${memberId}`)
    else if(location.pathname.startsWith('/Admin'))
      navigate(`/Admin/${employeeID}`)
    else navigate(`/`);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-[#faf0e6] rounded-lg shadow-lg mt-10 ">
      <h2 className="text-center text-3xl mb-6 text-[#165e22]">Payment Page</h2>

      <div className="mb-6">
        <p className="text-lg"><strong>Selected Time:</strong> {selectedTime}</p>
        <p className="text-lg"><strong>Selected Date:</strong> {selectedDate}</p>
        <p className="text-lg"><strong>Adult Tickets:</strong> {adultTickets}</p>
        <p className="text-lg"><strong>Child Tickets:</strong> {childTickets}</p>
        <p className="text-lg"><strong>Senior Tickets:</strong> {seniorTickets}</p>
        <p className="text-lg"><strong>Infant Tickets:</strong> {infantTickets}</p>
        <p className="text-lg"><strong>Final Price:</strong> ${finalPrice}</p>
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-lg mb-2">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-3 text-lg border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex justify-between gap-4">
        <button 
          className="bg-[#faf0e6] text-[#165e22] px-6 py-3 text-lg border border-[#165e22] rounded-md hover:bg-[#e1f7e7]"
          onClick={handleBackToTimeSlot}>
          Back to Select Time Slot
        </button>
        <button 
          className="bg-[#165e22] text-white px-6 py-3 text-lg rounded-md hover:bg-[#144e1a]"
          onClick={handleSubmit}>
          Submit Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
