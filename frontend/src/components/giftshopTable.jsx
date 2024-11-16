import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import "../index.css";
// import { useNavigate } from "react-router-dom";
// import { set } from "mongoose";

const itemsPerPage = 10;

function GiftshopTable() {
    const [inventoryData, setInventoryData] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const [itemSearchTerm, setItemSearchTerm] = useState("");

     // Modal states
     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
     const [selectedItem, setSelectedItem] = useState(null);

     // Form fields
    const [newName, setName] = useState('');
    const [newPrice, setPrice] = useState(0);
    const [newTotalQuantity, setTotalQuantity] = useState(0);
    const [newCategory, setCategory] = useState('');
    const [newDescript, setDescript] = useState('');
    
    useEffect(() => {
        fetchInventoryData();
    }, []);   

    const fetchInventoryData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/inventory/`);
            if (response.status !== 200) throw new Error("Failed to fetch Item data");
            setInventoryData(response.data);
        } catch (error) {
            console.error("Error fetching Item data:", error);
        }
    };

    const handlePageChange = (page) => setCurrentPage(page);

    function clearForm() {
        setName('');
        setPrice('');
        setTotalQuantity('');
        setCategory('');
        setDescript('');
    };

    const handleAddItem = async (e) => {
        e.preventDefault();

        const newItem = {
            itemName: newName,
            itemPrice: newPrice,
            totalQuantity: newTotalQuantity || null,
            category: newCategory || null,
            descript: newDescript || null
        };

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/inventory/add`, newItem);
            fetchInventoryData();
            clearForm();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to add item");
        }
    };

    useEffect(() => {
        if (selectedItem) {
            setName(selectedItem.itemName || '');
            setPrice(selectedItem.newPrice || '');
            setTotalQuantity(selectedItem.totalQuantity || '');
            setCategory(selectedItem.category || '');
        }
    }, [selectedItem]);

     // Delete item
     const deleteItem = async (itemID) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/inventory/${itemID}`);
            alert("Item deleted successfully.");
            fetchInventoryData();
        } catch (error) {
            console.error("Error deleting Item:", error);
            alert("Failed to delete Item.");
        }
    };

    // Sort data
    const handleHeaderClick = (field) => {
        setSortField(field);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

     // Handle Edit Modal
     const handleEditItemOptions = async (ItemID) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/inventory/${ItemID}`);
            setSelectedItem(response.data);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error("Error fetching Item details:", error);
        }
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        const updatedItem = {
            itemID: selectedItem.itemID,
            itemName: newName,
            itemPrice: newPrice,
            totalQuantity: newTotalQuantity || null,
            category: newCategory || null,
            descript: newDescript || null
        };
    
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/inventory/${itemID}`, updatedItem);
            clearForm();
            setIsEditModalOpen(false);
            fetchInventoryData();
            alert("Item updated successfully!");
        } catch (error) {
            console.error("Error editing item:", error);
            alert("Failed to edit item.");
        }
    };

      // Sorting logic
      const sortedData = React.useMemo(() => {
        if (!sortField) return inventoryData;
        const sorted = [...inventoryData].sort((a, b) => {
            if (a[sortField] < b[sortField]) return -1;
            if (a[sortField] > b[sortField]) return 1;
            return 0;
        });
        return sortDirection === "asc" ? sorted : sorted.reverse();
    }, [inventoryData, sortField, sortDirection]);

    // Filtered and paginated data
    const filteredData = sortedData.filter((item) =>
        item.itemName.toLowerCase().includes(itemSearchTerm.toLowerCase())
    );
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

return (
<main className="min-h-screen bg-[#EFEDE5] w-screen flex justify-center">
    <div className="container mx-auto p-6">
        <h1 className="text-4xl text-center mb-6 mt-24 text-[#313639]">Item Table</h1>
        <div className="flex justify-center my-4">
            <input
                type="text"
                className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                value={itemSearchTerm}
                onChange={(e) => setItemSearchTerm(e.target.value)}
                placeholder="Search by Item name"
            />
        </div>
            <div className="flex justify-center my-4">
                <button
                    className="ml-4 px-4 py-2 bg-[#8AA686] text-white rounded"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Item
                </button>
            </div>

        <table className="divide-y divide-gray-300 mb-6 w-full text-center bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
                <tr>
                    <th onClick={() => handleHeaderClick("name")}>Name</th>
                    <th onClick={() => handleHeaderClick("price")}>Price</th>
                    <th onClick={() => handleHeaderClick("totalQuantity")}>Quantity</th>
                    <th onClick={() => handleHeaderClick("category")}>Category</th>
                    <th onClick={() => handleHeaderClick("description")}>Description</th>
                    <th>Manage</th>
                </tr>
            </thead>
            <tbody>
                {paginatedData.map((item) => (
                    <tr key={item.itemID}>
                        <td>{item.itemName}</td>
                        <td>{item.itemPrice}</td>
                        <td>{item.totalQuantity}</td>
                        <td>{item.category}</td>
                        <td>{item.descript}</td>
                        <td>
                            <button className="bg-[#8AA686] text-white py-2 px-4 rounded mx-1"
                                onClick={() => handleEditItemOptions(item.itemID)}>
                                Edit
                            </button>
                            <button className="bg-[#8AA686] text-white py-2 px-4 rounded mx-1"
                                onClick={() => deleteItem(item.itemID)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
            <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className={`px-3 py-1 border rounded-md ${
                    currentPage === 1 ? "bg-[#8AA686] text-white opacity-50" : "bg-[#8AA686] text-white hover:bg-[#6C8A5E]"
                }`}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 border rounded-md ${
                        currentPage === i + 1
                            ? "bg-[#8AA686] text-white"
                            : "bg-[#8AA686] text-white hover:bg-[#6C8A5E]"
                    }`}
                >
                    {i + 1}
                </button>
            ))}
            <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                className={`px-3 py-1 border rounded-md ${
                    currentPage === totalPages
                        ? "bg-[#8AA686] text-white opacity-50"
                        : "bg-[#8AA686] text-white hover:bg-[#6C8A5E]"
                }`}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>

        {isAddModalOpen && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
<div className="bg-white p-6 rounded-lg w-96">
    <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
    <form onSubmit={handleAddItem}>
        <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
                type="text"
                value={newName}
                onChange={(e) => setName(e.target.value)}
                required
                className="border w-full px-3 py-2 rounded"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium">Price</label>
            <input
                type="number"
                step="0.01" // Add this for decimal prices
                value={newPrice}
                onChange={(e) => setPrice(Number(e.target.value))} // Convert to number
                required
                className="border w-full px-3 py-2 rounded"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium">Total Quantity (optional)</label>
            <input
                type="number"
                step="1" // Whole numbers for quantity
                value={newTotalQuantity}
                onChange={(e) => setTotalQuantity(Number(e.target.value))} // Convert to number
                required
                className="border w-full px-3 py-2 rounded"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium">Category (optional)</label>
            <input
                type="text" // Changed to text
                value={newCategory}
                onChange={(e) => setCategory(e.target.value)}
                className="border w-full px-3 py-2 rounded"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium">Description (Optional)</label>
            <input
                type="text"
                value={newDescript}
                onChange={(e) => setDescript(e.target.value)}
                className="border w-full px-3 py-2 rounded"
            />
        </div>
        {/* <div className="mb-4">
            <label className="block text-sm font-medium">Species</label>
            <input
                type="text"
                value={newSpecies}
                onChange={(e) => setSpecies(e.target.value)}
                required
                className="border w-full px-3 py-2 rounded"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium">Classification</label>
            <input
                type="text"
                value={newClassification}
                onChange={(e) => setClassification(e.target.value)}
                required
                className="border w-full px-3 py-2 rounded"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium">Enclosure ID </label>
            <input
                type="number"
                value={newEnclosureID}
                onChange={(e) => setEnclosureID(e.target.value)}
                className="border w-full px-3 py-2 rounded"
            />
        </div> */}
        <div className="flex justify-end space-x-2">
            <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="bg-[#8AA686] text-white px-4 py-2 rounded"
            >
                Add Item
            </button>
        </div>
    </form>
</div>
</div>
)}

        {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-96">
                    <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
                    <form onSubmit={handleEditItem}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="border w-full px-3 py-2 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Price</label>
                            <input
                                type="number"
                                value={newPrice}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="border w-full px-3 py-2 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Total Quantity (optional)</label>
                            <input
                                type="number"
                                value={newTotalQuantity}
                                onChange={(e) => setTotalQuantity(e.target.value)}
                                required
                                className="border w-full px-3 py-2 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Category (Optional)</label>
                            <input
                                type="number"
                                value={newCategory}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border w-full px-3 py-2 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Description (Optional)</label>
                            <input
                                type="text"
                                value={newDescript}
                                onChange={(e) => setDescript(e.target.value)}
                                className="border w-full px-3 py-2 rounded"
                            />
                        </div>
                        {/* <div className="mb-4">
                            <label className="block text-sm font-medium">Species</label>
                            <input
                                type="text"
                                value={newSpecies}
                                onChange={(e) => setSpecies(e.target.value)}
                                required
                                className="border w-full px-3 py-2 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Classification</label>
                            <input
                                type="text"
                                value={newClassification}
                                onChange={(e) => setClassification(e.target.value)}
                                required
                                className="border w-full px-3 py-2 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Enclosure ID (Optional)</label>
                            <input
                                type="number"
                                value={newEnclosureID}
                                onChange={(e) => setEnclosureID(e.target.value)}
                                className="border w-full px-3 py-2 rounded"
                            />
                        </div> */}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

    </div>
</main>
  );
}

export default GiftshopTable
