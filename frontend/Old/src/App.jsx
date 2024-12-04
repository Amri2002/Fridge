import { useState } from 'react';
import './App.css';
import './index.css'; 
import './output.css'; 

function App() {
  const [items, setItems] = useState([
    { name: 'Banana', expiry: '31/12/2021', status: 'Expiring soon' },
    { name: 'Apple', expiry: '31/12/2021', status: 'Expired' },
    { name: 'Orange', expiry: '23/11/2026', status: 'Healthy' },
    { name: 'Guava', expiry: '16/08/2040', status: 'Healthy' },
    { name: 'Pineapple', expiry: '01/10/2023', status: 'Healthy' },
  ]);

  const [newItem, setNewItem] = useState({ name: '', expiry: '' });

  const addItem = () => {
    if (
      newItem.name.trim() &&
      newItem.expiry.trim() &&
      !items.some((item) => item.name === newItem.name)
    ) {
      setItems([...items, { ...newItem, status: 'Healthy' }]);
      setNewItem({ name: '', expiry: '' });
    } else {
      alert('Item is either empty or already exists in the fridge!');
    }
  };

  const removeItem = (name) => {
    setItems(items.filter((item) => item.name !== name));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Good Morning, Johny!</h1>
        <p className="text-center text-gray-500 mb-8">
          <span className="inline-block mr-2">🌟</span>
          <p>It&apos;s better to go shopping before this Friday</p>
        </p>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-1/2 mr-2">
              <label className="block mb-1">🍉 Item Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item Name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="w-1/2 ml-2">
              <label className="block mb-1">📅 Expiry Date</label>
              <input
                type="date"
                value={newItem.expiry}
                onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded ml-4 mt-6"
              onClick={addItem}
            >
              ADD TO FRIDGE
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">
              <span className="inline-block mr-2">⚠️</span>
              We Don&apos;t Want More Than One Piece Of The Same Food In Our Fridge.
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">Total items — {items.length}</span>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center"
          >
            <span className="font-semibold w-1/4">{item.name}</span>
            <span className="text-gray-500 w-1/4">Expiry date — {item.expiry}</span>
            <span
              className={`px-2 py-1 rounded w-1/6 text-center ${
                item.status === 'Expired'
                  ? 'bg-red-200 text-red-800'
                  : item.status === 'Expiring soon'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-green-200 text-green-800'
              }`}
            >
              {item.status}
            </span>
            <button
              className="text-gray-500 w-1/12 text-right"
              onClick={() => removeItem(item.name)}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
