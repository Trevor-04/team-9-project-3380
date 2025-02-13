import React, { useState, useEffect } from 'react';
import './tickets.css';
import { Link } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
//const {url} = require('../config.json')[process.env.NODE_ENV];

function TicketOptions() {
  const [visibleSection, setVisibleSection] = useState('generalAdmission');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isDateSelected, setIsDateSelected] = useState(false);

  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [seniorTickets, setSeniorTickets] = useState(0);
  const [infantTickets, setInfantTickets] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const navigate = useNavigate(); // Create navigate function here
  const location = useLocation();
  const { memberId } = useParams(); // Get memberId from the URL params
  const {employeeID} = useParams();
  const pricing = {
    '9am': { adult: 25, child: 15, senior: 20, infant: 0 },
    '10am': { adult: 20, child: 13.5, senior: 15, infant: 0 },
    '11am': { adult: 25, child: 15, senior: 20, infant: 0 },
    '12pm': { adult: 30, child: 15, senior: 25, infant: 0 },
    '1pm': { adult: 30, child: 15, senior: 25, infant: 0 },
    '2pm': { adult: 20, child: 13.5, senior: 15, infant: 0 },
    '3pm': { adult: 25, child: 15, senior: 20, infant: 0 },
    '4pm': { adult: 30, child: 15, senior: 25, infant: 0 },
    '5pm': { adult: 20, child: 13.5, senior: 15, infant: 0 },
  };

  function calculateTotalPrice(time, type = "all") {
    const rates = pricing[time];

    switch (type) {
      case "all": 
      return (
        (adultTickets * rates.adult) +
        (childTickets * rates.child) +
        (seniorTickets * rates.senior) +
        (infantTickets * rates.infant)
      );
      case "adult":
        return adultTickets * rates.adult
      case "child":
        return (childTickets * rates.child)
      case "senior":
        return (seniorTickets * rates.senior)
      case "infant": 
        return (infantTickets * rates.infant)
    }

  };

  function format12Hours(time) {
    const period = time >= 12 ? "pm" : "am";  // Determine AM or PM
    const hour = time % 12 || 12;             // Convert 0 or 13-23 to 12-hour format
    return `${hour}${period}`;
}

  // Handle date change and update state
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    setIsDateSelected(true);
  };

  const TimeSlots = () => {
    const formattedDate = new Date(selectedDate + "T00:00").toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  
    // Get the current time
    const now = new Date();
    const currentHour = now.getHours();
  
    // Determine if the selected date is today
    const isToday = new Date(selectedDate).toDateString() === now.toDateString();
  
    // Check if a time slot is in the past for today
    const isTimeSlotDisabled = (time) => {
      const hour = parseInt(time); // Extract the hour from the time (e.g., '9am' becomes 9)
      
      // Disable time slots only for today if the time is before the current time
      return isToday && hour <= currentHour;
    };
  
    // Handle time slot selection and navigate to payment page
    const handleTimeSlotClick = async (time) => {
      if (!isTimeSlotDisabled(time)) {
        const total = await handleSubmitButton(time); // Get the final price directly from handleSubmitButton
        setFinalPrice(total); // Update the state immediately
        // Use the calculated total for navigation
        if (location.pathname.startsWith('/member')) {
        navigate(`/member/${memberId}/payment`, { 
          state: { 
            selectedTime: time, 
            selectedDate, 
            adultTickets, 
            childTickets, 
            seniorTickets, 
            infantTickets, 
            finalPrice: total // Pass the calculated total here
          } 
        });
      }
      else if (location.pathname.startsWith('/Admin')) {
        navigate(`/Admin/${employeeID}/payment`, { 
          state: { 
            selectedTime: time, 
            selectedDate, 
            adultTickets, 
            childTickets, 
            seniorTickets, 
            infantTickets, 
            finalPrice: total // Pass the calculated total here
          } 
        });
      }
      else {
      navigate(`/payment`, { 
        state: { 
          selectedTime: time, 
          selectedDate, 
          adultTickets, 
          childTickets, 
          seniorTickets, 
          infantTickets, 
          finalPrice: total // Pass the calculated total here
        } 
      });
    }
    }
  };
  
    const handleSubmitButton = async (time) => {
      try {
        const tickets = [adultTickets, childTickets, seniorTickets, infantTickets];
        const ticketTypeMap = ["adult", "child", "senior", "infant"];
        let total = 0;
    
        for (let i = 0; i < tickets.length; i++) {
          if (tickets[i] > 0) {
            const dateNow = new Date();
            const dateString = dateNow.toISOString().split("T");
    
            let purchasedForDate = new Date(selectedDate);
            purchasedForDate.setHours(time - (dateNow.getTimezoneOffset() / 60));
            const purchasedFor = purchasedForDate.toISOString().split("T");
    
            const dataObject = {
              date_purchased: `${dateString[0]} ${dateString[1].substring(0, dateString[1].indexOf("."))}`,
              ticketType: i,
              ticketPrice: calculateTotalPrice(format12Hours(time), ticketTypeMap[i]),
              time_purchased: `${purchasedFor[0]} ${purchasedFor[1].substring(0, purchasedFor[1].indexOf("."))}`,
            };
            total += calculateTotalPrice(format12Hours(time), ticketTypeMap[i]);
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tickets/add/`, dataObject);
          }
        }
        setFinalPrice(total);
        return(total);
      } catch (error) {
        console.error("Error adding tickets:", error);
      }
    };
    

    return (
      <div className="general-admission">
        <button 
          className="update-tickets-button"
          onClick={() => setShowTimeSlots(false)} // Go back to General Admission view
        >
          Update Tickets
        </button>
  
        <h2>{formattedDate}</h2>
  
        <div className="time-slots-container">
          {/* Morning Time Slots */}
          <div className="time-slot-column">
            <h3>Morning</h3>
            <div
              className={`time-slot-box ${isTimeSlotDisabled(9) ? 'disabled' : ''}`}
              onClick={() => handleTimeSlotClick(9)}
            >
              <h4><strong>9am</strong></h4>
              {isTimeSlotDisabled(9) ? <p>Unavailable</p> : (
                <>
                  <p>Total Price: <strong>${calculateTotalPrice('9am').toFixed(2)}</strong></p>
                  <p>
                    {adultTickets > 0 && `${adultTickets} x Adult, `}
                    {childTickets > 0 && `${childTickets} x Child, `}
                    {seniorTickets > 0 && `${seniorTickets} x Senior, `}
                    {infantTickets > 0 && `${infantTickets} x Infant`}
                  </p>
                </>
              )}
            </div>
            <div
              className={`time-slot-box ${isTimeSlotDisabled(10) ? 'disabled' : ''}`}
              onClick={() => handleTimeSlotClick(10)}
            >
              <h4><strong>10am</strong></h4>
              {isTimeSlotDisabled(10) ? <p>Unavailable</p> : (
                <>
                  <p>Total Price: <strong>${calculateTotalPrice('10am').toFixed(2)}</strong></p>
                  <p>
                    {adultTickets > 0 && `${adultTickets} x Adult, `}
                    {childTickets > 0 && `${childTickets} x Child, `}
                    {seniorTickets > 0 && `${seniorTickets} x Senior, `}
                    {infantTickets > 0 && `${infantTickets} x Infant`}
                  </p>
                </>
              )}
            </div>
            <div
              className={`time-slot-box ${isTimeSlotDisabled(11) ? 'disabled' : ''}`}
              onClick={() => handleTimeSlotClick(11)}
            >
              <h4><strong>11am</strong></h4>
              {isTimeSlotDisabled(11) ? <p>Unavailable</p> : (
                <>
                  <p>Total Price: <strong>${calculateTotalPrice('11am').toFixed(2)}</strong></p>
                  <p>
                    {adultTickets > 0 && `${adultTickets} x Adult, `}
                    {childTickets > 0 && `${childTickets} x Child, `}
                    {seniorTickets > 0 && `${seniorTickets} x Senior, `}
                    {infantTickets > 0 && `${infantTickets} x Infant`}
                  </p>
                </>
              )}
            </div>
          </div>
  
          {/* Afternoon Time Slots */}
          <div className="time-slot-column">
            <h3>Afternoon</h3>
            <div
              className={`time-slot-box ${isTimeSlotDisabled(12) ? 'disabled' : ''}`}
              onClick={() => handleTimeSlotClick(12)}
            >
              <h4><strong>12pm</strong></h4>
              {isTimeSlotDisabled(12) ? <p>Unavailable</p> : (
                <>
                  <p>Total Price: <strong>${calculateTotalPrice('12pm').toFixed(2)}</strong></p>
                  <p>
                    {adultTickets > 0 && `${adultTickets} x Adult, `}
                    {childTickets > 0 && `${childTickets} x Child, `}
                    {seniorTickets > 0 && `${seniorTickets} x Senior, `}
                    {infantTickets > 0 && `${infantTickets} x Infant`}
                  </p>
                </>
              )}
            </div>
            <div
              className={`time-slot-box ${isTimeSlotDisabled(13) ? 'disabled' : ''}`}
              onClick={() => handleTimeSlotClick(13)}
            >
              <h4><strong>1pm</strong></h4>
              {isTimeSlotDisabled(13) ? <p>Unavailable</p> : (
                <>
                  <p>Total Price: <strong>${calculateTotalPrice('1pm').toFixed(2)}</strong></p>
                  <p>
                    {adultTickets > 0 && `${adultTickets} x Adult, `}
                    {childTickets > 0 && `${childTickets} x Child, `}
                    {seniorTickets > 0 && `${seniorTickets} x Senior, `}
                    {infantTickets > 0 && `${infantTickets} x Infant`}
                  </p>
                </>
              )}
            </div>
            <div
              className={`time-slot-box ${isTimeSlotDisabled(14) ? 'disabled' : ''}`}
              onClick={() => handleTimeSlotClick(14)}
            >
              <h4><strong>2pm</strong></h4>
              {isTimeSlotDisabled(14) ? <p>Unavailable</p> : (
                <>
                  <p>Total Price: <strong>${calculateTotalPrice('2pm').toFixed(2)}</strong></p>
                  <p>
                    {adultTickets > 0 && `${adultTickets} x Adult, `}
                    {childTickets > 0 && `${childTickets} x Child, `}
                    {seniorTickets > 0 && `${seniorTickets} x Senior, `}
                    {infantTickets > 0 && `${infantTickets} x Infant`}
                  </p>
                </>
              )}
            </div>
          </div>
  
          {/* Evening Time Slots */}
          <div className="time-slot-column">
            <h3>Evening</h3>
            <div
              className={`time-slot-box ${isTimeSlotDisabled(15) ? 'disabled' : ''}`}
              onClick={() => handleTimeSlotClick(15)}
            >
              <h4><strong>3pm</strong></h4>
              {isTimeSlotDisabled(15) ? <p>Unavailable</p> : (
                <>
                  <p>Total Price: <strong>${calculateTotalPrice('3pm').toFixed(2)}</strong></p>
                  <p>
                    {adultTickets > 0 && `${adultTickets} x Adult, `}
                    {childTickets > 0 && `${childTickets} x Child, `}
                    {seniorTickets > 0 && `${seniorTickets} x Senior, `}
                    {infantTickets > 0 && `${infantTickets} x Infant`}
                  </p>
                </>
              )}
            </div>
            <div
              className={`time-slot-box ${isTimeSlotDisabled(16) ? 'disabled' : ''}`}
              onClick={() => handleTimeSlotClick(16)}
            >
              <h4><strong>4pm</strong></h4>
              {isTimeSlotDisabled(16) ? <p>Unavailable</p> : (
                <>
                  <p>Total Price: <strong>${calculateTotalPrice('4pm').toFixed(2)}</strong></p>
                  <p>
                    {adultTickets > 0 && `${adultTickets} x Adult, `}
                    {childTickets > 0 && `${childTickets} x Child, `}
                    {seniorTickets > 0 && `${seniorTickets} x Senior, `}
                    {infantTickets > 0 && `${infantTickets} x Infant`}
                  </p>
                </>
              )}
            </div>
            <div
              className={`time-slot-box ${isTimeSlotDisabled(17) ? 'disabled' : ''}`}
              onClick={() => handleTimeSlotClick(17)}
            >
              <h4><strong>5pm</strong></h4>
              {isTimeSlotDisabled(17) ? <p>Unavailable</p> : (
                <>
                  <p>Total Price: <strong>${calculateTotalPrice('5pm').toFixed(2)}</strong></p>
                  <p>
                    {adultTickets > 0 && `${adultTickets} x Adult, `}
                    {childTickets > 0 && `${childTickets} x Child, `}
                    {seniorTickets > 0 && `${seniorTickets} x Senior, `}
                    {infantTickets > 0 && `${infantTickets} x Infant`}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
    // return (
    //   <div className="general-admission">
    //     <button 
    //       className="update-tickets-button"
    //       onClick={() => setShowTimeSlots(false)} 
    //     >
    //       Update Tickets
    //     </button>
    //     <h2>{formattedDate}</h2>
    //     <div className="time-slots-container">
    //       {/* Time slots generation logic */}
    //       <div className="time-slot-column">
    //         {Object.keys(pricing).map((timeSlot) => {
    //           const hour = parseInt(timeSlot.split('am')[0].split('pm')[0]) || 12;
    //           const time = format12Hours(hour);
    //           return (
    //             <div
    //               className={`time-slot-box ${isTimeSlotDisabled(time) ? 'disabled' : ''}`}
    //               onClick={() => handleTimeSlotClick(time)}
    //               key={time}
    //             >
    //               <h4><strong>{time}</strong></h4>
    //               {isTimeSlotDisabled(time) ? <p>Unavailable</p> : (
    //                 <>
    //                   <p>Total Price: <strong>${calculateTotalPrice(time).toFixed(2)}</strong></p>
    //                   <p>
    //                     {adultTickets > 0 && `${adultTickets} x Adult, `}
    //                     {childTickets > 0 && `${childTickets} x Child, `}
    //                     {seniorTickets > 0 && `${seniorTickets} x Senior, `}
    //                     {infantTickets > 0 && `${infantTickets} x Infant`}
    //                   </p>
    //                 </>
    //               )}
    //             </div>
    //           );
    //         })}
    //       </div>
    //     </div>
    //   </div>
    // );
  };
  
  

  const GeneralAdmission = () => (
    <div className="general-admission">
      <h2>General Admission</h2>
      <div className="ticket-categories">
        <div className="ticket-category">
          <label>Adult (Ages 13-64)</label>
          <input 
            type="number" 
            min="0" 
            value={adultTickets}
            onChange={(e) => setAdultTickets(Number(e.target.value))} 
          />
        </div>
        <div className="ticket-category">
          <label>Child (Ages 3-12)</label>
          <input 
            type="number" 
            min="0" 
            value={childTickets}
            onChange={(e) => setChildTickets(Number(e.target.value))} 
          />
        </div>
        <div className="ticket-category">
          <label>Senior (65+)</label>
          <input 
            type="number" 
            min="0" 
            value={seniorTickets}
            onChange={(e) => setSeniorTickets(Number(e.target.value))} 
          />
        </div>
        <div className="ticket-category">
          <label>Infant (2 & Under)</label>
          <input 
            type="number" 
            min="0" 
            value={infantTickets}
            onChange={(e) => setInfantTickets(Number(e.target.value))} 
          />
        </div>
        <div className="ticket-date">
          <label><strong>When?</strong></label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={handleDateChange} 
            min={new Date().toISOString().split("T")[0]} // Disables past dates
          />
        </div>
        <button 
          className="continue-button" 
          onClick={() => isDateSelected ? setShowTimeSlots(true) : alert('Please select a date!')}
        >
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <ul className="ticket-list">
        <li className="ticket-item">
          <button
            className={`ticket-link ${visibleSection === 'generalAdmission' ? 'active' : ''}`}
            onClick={() => setVisibleSection('generalAdmission')}
          >
            General Admission
          </button>
        </li>
        {/* <li className="ticket-item">
          <Link to="/discounted-tickets" className="ticket-link">Discounted Tickets</Link>
        </li> */}
        {!location.pathname.startsWith('/member') && !location.pathname.startsWith('/Admin') && (
        <li className="ticket-item">
          <Link to="/Signup" className="ticket-link">Membership Portal</Link>
        </li>
      )}
      </ul>

      <div className="general-admission-container">
        {visibleSection === 'generalAdmission' && (
          showTimeSlots ? <TimeSlots /> : <GeneralAdmission />
        )}
      </div>
    </div>
  );
}

export default TicketOptions;