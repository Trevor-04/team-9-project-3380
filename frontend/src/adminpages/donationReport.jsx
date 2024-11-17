import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DonationSponsorReport() {
  const [donationData, setDonationData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [chartType, setChartType] = useState("Bar");
  const ChartComponent = chartType === "Bar" ? Bar : Line;

  useEffect(() => {
    if (startDate && endDate) {
      fetchDonationData();
    }
  }, [startDate, endDate]);

  const fetchDonationData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reports/donationStats`, {
        params: { startDate: moment(startDate).format("YYYY-MM-DD"), endDate: moment(endDate).format("YYYY-MM-DD") }
      });
      if (response.status !== 200) throw new Error("Failed to fetch donation data");
      setDonationData(response.data);
    } catch (err) {
      console.error("Error fetching donation data:", err);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Donation and Sponsor Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate ? moment(startDate).format("YYYY-MM-DD") : "N/A"} to ${endDate ? moment(endDate).format("YYYY-MM-DD") : "N/A"}`, 14, 30);

    const tableColumn = [
      "Donor Name",
      "Donation Amount",
      "Donor City",
      "Donor State",
      "Donor Email",
      "Sponsor Name",
      "Donation Type",
      "Donation Date"
    ];
    const tableRows = donationData.map(row => [
      row.donorName,
      row.donationAmount,
      row.donorCity,
      row.donorState,
      row.donorEmail,
      row.sponsorName,
      row.donationType,
      row.donationDateBySponsor
    ]);

    doc.autoTable({ startY: 40, head: [tableColumn], body: tableRows });
    doc.save("donation_sponsor_report.pdf");
  };

  const chartData = {
    labels: donationData.map(row => row.donorName),
    datasets: [
      {
        label: "Donation Amount",
        data: donationData.map(row => row.donationAmount),
        backgroundColor: "#8AA686",
      },
      {
        label: "Sponsor Name",
        data: donationData.map(row => row.sponsorName),
        backgroundColor: "#C0BAA4",
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#EFEDE5] w-screen flex justify-center">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl text-center mb-6 mt-24 text-[#313639]">Donation and Sponsor Report</h1>

        <div className="mb-4 flex justify-center space-x-4">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border-2 border-gray-300 h-10 px-4 rounded-lg"
                placeholderText="Select Start Date"
              />
            </div>
            <div>
              <label className="block text-sm">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border-2 border-gray-300 h-10 px-4 rounded-lg"
                placeholderText="Select End Date"
              />
            </div>
          </div>
          <button onClick={downloadPDF} className="bg-[#8AA686] text-white py-2 px-4 rounded">Download PDF</button>
          <button onClick={() => setViewMode(viewMode === "table" ? "chart" : "table")} className="bg-[#8AA686] text-white py-2 px-4 rounded">
            {viewMode === "table" ? "Switch to Chart View" : "Switch to Table View"}
          </button>
        </div>

        {viewMode === "table" ? (
          <table className="divide-y divide-gray-300 mb-6 w-full text-center bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 font-medium text-xl underline border">Donor Name</th>
                <th className="px-4 py-2 font-medium text-xl underline border">Donation Amount</th>
                <th className="px-4 py-2 font-medium text-xl underline border">Donor City</th>
                <th className="px-4 py-2 font-medium text-xl underline border">Donor State</th>
                <th className="px-4 py-2 font-medium text-xl underline border">Donor Email</th>
                <th className="px-4 py-2 font-medium text-xl underline border">Sponsor Name</th>
                <th className="px-4 py-2 font-medium text-xl underline border">Donation Type</th>
                <th className="px-4 py-2 font-medium text-xl underline border">Donation Date</th>
              </tr>
            </thead>
            <tbody>
              {donationData.map((row, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="px-4 py-2 border">{row.donorName}</td>
                  <td className="px-4 py-2 border">{row.donationAmount}</td>
                  <td className="px-4 py-2 border">{row.donorCity}</td>
                  <td className="px-4 py-2 border">{row.donorState}</td>
                  <td className="px-4 py-2 border">{row.donorEmail}</td>
                  <td className="px-4 py-2 border">{row.sponsorName}</td>
                  <td className="px-4 py-2 border">{row.donationType}</td>
                  <td className="px-4 py-2 border">{row.donationDateBySponsor.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="chart-container mb-6">
            <ChartComponent data={chartData} options={{ responsive: true }} />
          </div>
        )}
      </div>
    </main>
  );
}

export default DonationSponsorReport;
