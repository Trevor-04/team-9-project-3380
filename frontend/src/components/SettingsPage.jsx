import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function SettingsPage() {
  const [memberData, setMemberData] = useState(null);
  const [editData, setEditData] = useState({});
  const { memberId } = useParams(); // Get memberId from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/members/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMemberData(response.data);
        setEditData(response.data);  // Initialize with current data
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
  }, [navigate]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editData.memberBirthday) {
        editData.memberBirthday = new Date(editData.memberBirthday).toISOString().split('T')[0];
      }  
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/members/update`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Changes saved successfully');
      navigate(`/member/${memberId}`); // Redirect back to MemberPage with dynamic memberId
    } catch (error) {
      console.error("Error updating member data:", error);
      alert('Failed to save changes');
    }
  };

  if (!memberData) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Edit Member Info</h2>
      
      <div className="space-y-4">
        {/* Name */}
        <div className="flex space-x-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              name="memberFName" 
              value={editData.memberFName} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input 
              name="memberLName" 
              value={editData.memberLName} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            name="memberEmail" 
            value={editData.memberEmail} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input 
            name="memberPhone" 
            value={editData.memberPhone} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Additional Fields */}
        {/* Add more fields as needed */}

        {/* Save Button */}
        <div className="text-center">
          <button 
            onClick={handleSave} 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
