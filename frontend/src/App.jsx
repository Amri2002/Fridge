import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API Configuration - Easy to change for different environments
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5128';
console.log("API Base URL:", API_BASE_URL);


function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    expiryDate: ''
  });

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/fridge`);
      setItems(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setIsLoading(false);
      setItems([]);
    }
  };

  // Determine item status based on expiry date
  const getItemStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const oneMonthFromNow = new Date(today);
    oneMonthFromNow.setMonth(today.getMonth() + 1);

    if (expiry < today) return { label: 'Expired', className: 'bg-red-200 text-red-800' };
    if (expiry <= oneMonthFromNow) return { label: 'Expiring soon', className: 'bg-[#FFFDCC] text-yellow-800' };
    return { label: 'Healthy', className: 'bg-green-200 text-green-800' };
  };

  // Handle input changes for new item
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/fridge`, {
        name: newItem.name,
        expiryDate: newItem.expiryDate,
      });
  
      setItems((prev) => [...prev, response.data]);
  
      // Reset form
      setNewItem({ name: '', expiryDate: '' });
      alert("Fridge item added successfully!"); // Success alert
    } catch (error) {
      // Check if the error is a 409 Conflict (duplicate item)
      if (error.response && error.response.status === 409) {
        alert(error.response.data.message); // Show the error message from the backend
      } else {
        console.error('Error adding item:', error);
        alert("An error occurred while adding the fridge item.");
      }
    }
  };
  
  // Delete item with confirmation
  const handleDeleteItem = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/api/fridge/${id}`);
        // Optimistically remove item from list
        setItems(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };


  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full p-8">
        <div className='w-full lg:w-2/3 lg:mx-auto lg:p-6'>
          <h1 className="heading text-4xl font-extrabold text-center mb-2 mt-12">
            Good Morning, Johny!
          </h1>
          <p className="text-lg text-center text-gray-500 mb-8">
            <span className="inline-block mr-2">🌟</span>
            It's better to go shopping before this friday
          </p>

          {/* Add Item Form */}
          <div className="border border-gray-200 text-sm bg-white shadow-md rounded-lg p-12 mb-8">
            <form onSubmit={handleAddItem} className="grid grid-cols-3 gap-6 items-end mb-4">
              <div>
                <label className="block mb-1 font-semibold">🍉 Item Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="Item Name" 
                  className="w-full p-2 border rounded" 
                  required 
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">⏰ Expiry Date</label>
                <input 
                  type="date" 
                  name="expiryDate"
                  value={newItem.expiryDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded" 
                  required 
                />
              </div>
              <button 
                type="submit"
                className="text-xs font-bold button text-white px-4 py-2 rounded h-10"
              >
                ADD TO FRIDGE
              </button>
            </form>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 text-sm">
                <span className="inline-block mr-2">⚠️</span>
                We Don't Want More Than One Piece Of The Same Food In Our Fridge.
              </p>
            </div>
          </div>

          {/* Items Count */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500"></span>
            <button className="text-sm font-semibold status">
              Total items — {items.length.toString().padStart(2, '0')}
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="status text-center py-4">
              Loading fridge items...
            </div>
          )}

          {/* Error Handling for Empty Items */}
          {!isLoading && items.length === 0 && (
            <div className="status text-center py-4">
              No items in the fridge. Add some!
            </div>
          )}

          {/* Items List */}
          {!isLoading && items.map((item) => {
            const status = getItemStatus(item.expiryDate);
            return (
              <div 
                key={item.id} 
                className="border border-gray-100 bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center"
              >
                <span className="font-semibold w-1/6">{item.name}</span>
                <span className="text-xs font-semibold text-gray-500 w-1/4">
                  Expiry date — {new Date(item.expiryDate).toLocaleDateString()}
                </span>
                <span className='w-1/4'> </span>
                <span className={`text-xs font-bold rounded-[24px] ${status.className} px-2 py-1 rounded w-1/6 text-center`}>
                  {status.label}
                </span>
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-gray-500 w-1/12 text-center"
                >
                  <i className="fas fa-trash hover:text-[#E63F3F] transition-colors duration-200"></i>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
