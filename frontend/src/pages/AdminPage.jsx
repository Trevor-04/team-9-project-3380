import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {BarChart, LineChart, PieChart} from '../charts/barChart';

//const {url} = require('../config.json')[process.env.NODE_ENV];


export default function AdminPage() {
const [isDropdownOpen, setIsDropdownOpen]  = useState(false);
const dropdownRef = useRef();
const { employeeID } = useParams();
const [visitors, setVisitors] = useState(0);
const [subscribers, setSubscribers] = useState(0);
const [sales, setSales] = useState(0);
const [donations, setDonations] = useState(0);
const [revenue, setRevenue] = useState(0);
const [weeklyRevenue, setWeeklyRevenue] = useState(0);

const [revenueChartData, setRevenueChartData] = useState([]);
const [revenueWeeklyChartData, setRevenueWeeklyChartData] = useState([])

const [members, setMembers] = useState([]);
const navigate = useNavigate(); // Initialize useNavigate
const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
};

// Function to fetch all members
const fetchMembers = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/members`);
    if (response.status === 200) {
      setMembers(response.data.members);
    }
  } catch (error) {
    console.error("Error fetching members:", error);
  }
};

const deleteMember = async (memberID) => {
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/members/${memberID}`);
    setMembers(members.filter((member) => member.memberID !== memberID));
  } catch (error) {
    console.error("Error deleting member:", error);
  }
};


const getVisitors = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/visitorCount/`,{
      params: {startDate, endDate},
    });
    
    if (response.status === 200) { // if it works
      setVisitors(response.data.visitorCount)
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const getSales = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/transactionCount/`,{
      params: {startDate, endDate},
    });
    
    if (response.status === 200) { // if it works
      setSales(response.data.transactionCount[0].transactionCount || 0)
    }
  } catch (err) {
    console.log(err);
    throw err;
  }

}

const getRevenue = async (startDate, endDate) => {
  // tickets + donations;
  let tempRev = 0;

    let params = {};
    const ticketRevenue = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/ticketRevenue/`, {
      params
    });

    const restaurantRevenue = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/restaurant/total`, {
      params
    });

    const concessionRevenue = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/concession/total`, {
      params
    });

    const giftRevenue = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/giftshop/total`, {
      params
    });

    if (ticketRevenue.status === 200) tempRev += ticketRevenue.data.reduce((sum, ticket) => {
      return sum + parseFloat(ticket.total_sales_revenue);
    }, 0);
    if (restaurantRevenue.status === 200) tempRev += Number(restaurantRevenue.data.total_sales_revenue || 0);
    if (concessionRevenue.status === 200) tempRev += Number(concessionRevenue.data.total_sales_revenue || 0);
    if (giftRevenue.status === 200) tempRev += Number(giftRevenue.data.total_sales_revenue || 0);
    tempRev += Number(donations);

    (startDate && endDate) ? setWeeklyRevenue(tempRev) : setRevenue(tempRev);
}

const getSubcribers = async (startDate, endDate) => {
  try {
    
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/subscriberCount`, {
      params: {startDate, endDate}
    });
    if (response.status === 200) {
      setSubscribers(response.data.subscriberCount.length);
    } 
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const getDonations = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/donations/total/`, {
      params: {startDate, endDate},
    });

    if (response.status === 200) {
      setDonations(response.data.totalAmount);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const getSalesCharts = async (startDate, endDate) => {

  let oneWeekAgo = new Date(), oneWeekAgoFormatted, startDateFormatted;
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (startDate && endDate) {
    oneWeekAgoFormatted = oneWeekAgo.toISOString().split('T')[0]; // e.g., "2023-03-20"
    startDateFormatted = new Date(startDate).toISOString().split('T')[0];
  }


  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/charts/totalSales`, {
      params: {startDate, endDate}
    });

    if (res.status === 200) {
      let oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoFormatted = oneWeekAgo.toLocaleDateString('en-CA');

      if (!startDate && !endDate) {
        setRevenueChartData(res.data.totalSales); // For the case when no date range is provided
      } else if (startDate === oneWeekAgoFormatted) {
        setRevenueWeeklyChartData(res.data.totalSales); // Assuming `weeklySales` is in the API response
      } 
    }

  } catch (err) {
    console.log(err);
    throw err;
  }
}

const getTopProductsChart = async (startDate, endDate, limit) => {
  let oneWeekAgo = new Date();
  let oneWeekAgoFormatted, startDateFormatted;

  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (startDate && endDate) {
    oneWeekAgoFormatted = oneWeekAgo.toISOString().split("T")[0];
    startDateFormatted = new Date(startDate).toISOString().split("T")[0];
  }

  const backgroundColors = [
    "#6A9E73", // Restaurant Sales color
    "#8BB174", // Concession Sales color
    "#A1C181", // Gift Shop Sales color
    "#B6CF9E", // Ticket Sales color
    "#D1E2C4"  // Donations color
  ];

  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/charts/topProducts`, {
      params: { startDate, endDate, limit }
    });

    if (response.status === 200) {
      const topProducts = response.data.totalSales;

      if (!startDate && !endDate) {
        // For the case when no date range is provided, set top products data directly
        setTopProductsData({
          labels: topProducts.flatMap(productType => productType.products.map(p => p.product)),
          datasets: [{
            label: "Top Products by Revenue",
            data: topProducts.flatMap(productType => productType.products.map(p => p.total_revenue)),
            backgroundColor: backgroundColors,
            borderColor: topProducts.flatMap(() => 'rgba(75, 192, 192, 1)'),
            borderWidth: 1
          }]
        });
      } else if (startDate === oneWeekAgoFormatted) {
        // For the specific date range, adjust the chart data accordingly
        setTopWeeklyProductsData({
          labels: topProducts.flatMap(productType => productType.products.map(p => p.product)),
          datasets: [{
            label: "Top Products by Revenue (Weekly)",
            data: topProducts.flatMap(productType => productType.products.map(p => p.total_revenue)),
            backgroundColor: backgroundColors,
            borderColor: topProducts.flatMap(() => 'rgba(75, 192, 192, 1)'),
            borderWidth: 1
          }]
        });
      }
    }
  } catch (err) {
    console.log("Error fetching top products:", err);
    throw err;
  }
};

  // Close the dropdown if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, []);

  useEffect(() => {
    let startDate = new Date();
    startDate.setDate(startDate.getDate()-7)
    startDate = startDate.toLocaleDateString('en-CA');
    let endDate = (new Date()).toLocaleDateString('en-CA');
    
    getSubcribers(startDate, endDate);
    getVisitors(startDate, endDate);
    getSales(startDate, endDate);
    getDonations(); // put startDate and endDate if needed 
    getRevenue();
    getRevenue(startDate, endDate);
    getSalesCharts();
    getSalesCharts(startDate, endDate);
    getTopProductsChart();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{
      label: "Revenue by Category (Overall)",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  });

  const [weeklyRevenueData, setWeeklyRevenueData] = useState({
    labels: [],
    datasets: [{
      label: "Revenue by Category (Weekly)",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  });

  const [topProductsData, setTopProductsData] = useState({
    labels: [],
    datasets: [{
      label: "Top Products by Revenue",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  });

  const [topWeeklyProductsData, setTopWeeklyProductsData] = useState({
    labels: [],
    datasets: [{
      label: "Top Products by Revenue",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  });

  useEffect(() => {
    if (revenueChartData.length > 0) { 
      setRevenueData({
        labels: revenueChartData.map(data => data.label),
        datasets: [{
          label: "Revenue by Category",
          data: revenueChartData.map(data => Number(data.revenue)),
          backgroundColor: revenueChartData.map(data => data.color),
          borderColor: revenueChartData.map(data => data.color),
          borderWidth: 1
        }]
      });
    }
  }, [revenueChartData]); 

  useEffect(() => {
    if (revenueWeeklyChartData.length > 0) { 
      setWeeklyRevenueData({
        labels: revenueWeeklyChartData.map(data => data.label),
        datasets: [{
          label: revenueWeeklyChartData.map(data => data.label),
          data: revenueWeeklyChartData.map(data => Number(data.revenue)), 
          backgroundColor: revenueWeeklyChartData.map(data => data.color),
          borderColor: revenueWeeklyChartData.map(data => data.color),
          borderWidth: 1
        }]
      });
    }
  }, [revenueWeeklyChartData]); 

  useEffect(() => {
    if (topProductsData.length > 0) { 
      setTopProductsData({
        labels: topProductsData.flatMap(productType => productType.products.map(p => p.product)),
        datasets: [{
          label: "Top Products by Revenue",
          data: topProductsData.flatMap(productType => productType.products.map(p => p.total_revenue)),
          backgroundColor: topProductsData.flatMap((_, idx) => `rgba(75, 192, 192, 0.${idx + 3})`),
          borderColor: topProductsData.flatMap(() => 'rgba(75, 192, 192, 1)'),
          borderWidth: 1
        }]
      });
    }
  }, [topProductsData]); 

  useEffect(() => {
    if (topWeeklyProductsData.length > 0) { 
      setTopWeeklyProductsData({
        labels: topWeeklyProductsData.flatMap(productType => productType.products.map(p => p.product)),
        datasets: [{
          label: "Top Products by Revenue",
          data: topWeeklyProductsData.flatMap(productType => productType.products.map(p => p.total_revenue)),
          backgroundColor: topWeeklyProductsData.flatMap((_, idx) => `rgba(75, 192, 192, 0.${idx + 3})`),
          borderColor: topWeeklyProductsData.flatMap(() => 'rgba(75, 192, 192, 1)'),
          borderWidth: 1
        }]
      });
    }
  }, [topWeeklyProductsData]); 

  return (
    <div>
      <header className="bg-white text-[#165e229e] p-5 flex items-cente" ref={dropdownRef}>
        <h1>Admin Page</h1>

        {/* Button to redirect to Total Reports */}
        <button
          onClick={() => navigate(`/Admin/${employeeID}/totalReport`)}
          className="ml-8 bg-[#165e229e] text-white font-bold w-[120px] h-[35px] rounded-2xl"
        >
          Reports
        </button>

        <button
          onClick={() => navigate(`/Admin/${employeeID}/employeeTable`)}
          className="ml-8 bg-[#165e229e] text-white font-bold w-[120px] h-[35px] rounded-2xl"
        >
          Employees
        </button>

        {/* <button 
          onClick={() => navigate(`/Admin/${employeeID}/events`, { state: { editMode: true } })}
          className="ml-8 bg-[#165e229e] text-white font-bold w-[120px] h-[35px] rounded-2xl"
        >
          Edit Events
        </button> */}

        <button
          onClick={() => navigate(`/Admin/${employeeID}/animalTable`)}
          className="ml-8 bg-[#165e229e] text-white font-bold w-[120px] h-[35px] rounded-2xl"
        >
          Animals
        </button>

        <button
          onClick={() => navigate(`/Admin/${employeeID}/giftshopTable`)}
          className="ml-8 bg-[#165e229e] text-white font-bold w-[120px] h-[35px] rounded-2xl"
        >
          Gift Shop
        </button>

        <button
          onClick={() => navigate(`/Admin/${employeeID}/feedingSchedule`)}
          className="ml-8 bg-[#165e229e] text-sm text-white font-bold w-[120px] h-[35px] rounded-2xl"
        >
          Feeding Report
        </button>

        <button
          onClick={() => navigate(`/Admin/${employeeID}/donationReport`)}
          className="ml-8 bg-[#165e229e] text-sm text-white font-bold w-[120px] h-[35px] rounded-2xl"
        >
          Donation Report
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 mt-[20px]">

        <div className="sales text-[#165e229e] w-full bg-white p-6 rounded-lg shadow-sm">
          <div className='flex items-center'>
            <h3>Sales this week</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 flex ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
            </div>
              <p className='mt-2'>{sales}</p>
            </div>

        <div className="visitors text-[#165e229e] w-full bg-white p-6 rounded-lg shadow-sm">
          <div className='flex items-center'>
              <h3>Visitors this week</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 flex ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          </div>
          <p className='mt-2'>{visitors}</p>
        </div>

        <div className="earnings text-[#165e229e] w-full bg-white p-6 rounded-lg shadow-sm">
        <div className='flex items-center'>
         <h3> Revenue this week</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 flex ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
          </svg>
          </div>
            <p className='mt-2'>${weeklyRevenue}</p>
        </div>

        <div className="totalRev text-[#165e229e] w-full bg-white p-6 rounded-lg shadow-sm">
          <div className='flex items-center'>
          <h3>Total Revenue</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 flex ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        </div>
          <p className='mt-2'>${revenue}</p>
        </div>

        <div className="newMems text-[#165e229e] w-full bg-white p-6 rounded-lg shadow-sm">
        <div className='flex items-center'>
         <h3> New members this week</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 flex ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          </div>
          <p className='mt-2'>{subscribers}</p>
        </div>

        <div className="totalDons text-[#165e229e] w-full bg-white p-6 rounded-lg shadow-sm">
        <div className='flex items-center'>
         
         <h3>Total Donations</h3> 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 flex ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
        </div>
          <p className='mt-2'>${donations}</p>
        </div>

        <div className='text-[#165e229e] bg-white p-6 rounded-lg shadow-sm h-[500px] w-full'>  
          Total Revenue Pie Chart
          <PieChart chartData = {revenueData}> </PieChart>
        </div>

        <div className='text-[#165e229e] bg-white p-6 rounded-lg shadow-sm h-[500px] w-full'>
          Total Revenue by Week Pie Chart
          <PieChart chartData = {weeklyRevenueData}></PieChart> 
        </div> 

        <div className='text-[#165e229e] bg-white p-6 rounded-lg shadow-sm h-[500px] w-full'>
          Total Revenue by Item
          <BarChart chartData={topProductsData} />
        </div>

        <div className="members-list text-[#165e229e] w-full bg-white p-6 rounded-lg shadow-sm mt-4">
          Current Members:
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}> {/* Adjust height as needed */}
            <ul>
              {members.map((member) => (
                <li key={member.memberID} className="flex justify-between items-center py-2">
                  <div>
                    {member.memberFName} {member.memberLName} ({member.memberEmail})
                  </div>
                  <button
                    onClick={() => deleteMember(member.memberID)}
                    className="ml-4 bg-red-500 text-white font-bold px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

     
    </div>
  );
}