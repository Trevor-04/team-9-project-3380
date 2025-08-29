import React from 'react';
import '../components/tickets.css';
import TicketOptions from '../components/ticket';
function Tickets() {
  return (
  
    <div className='flex-1'>
      <header className='w-full text-center text-white font-bold bg-[#165e229e] py-12'>
      <h1 className="relative text-2xl md:text-4xl lg:text-5xl">Buy Tickets</h1>
    </header>
    <TicketOptions /> 
    </div>
  );
}

export default Tickets;