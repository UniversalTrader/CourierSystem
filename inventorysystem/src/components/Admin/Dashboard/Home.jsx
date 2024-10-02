import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [ridersCount, setRidersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch counts
  //       const ridersResponse = await axios.get('http://localhost:8000/riders/count');
  //       const productsResponse = await axios.get('http://localhost:8000/products/count');
  //       const ordersResponse = await axios.get('http://localhost:8000/orders/count');

  //       setRidersCount(ridersResponse.data.count);
  //       setProductsCount(productsResponse.data.count);
  //       setOrdersCount(ordersResponse.data.count);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div className="container bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4 md:p-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-600">Welcome to the Dashboard</h2>
        <p className="text-base md:text-lg mb-6">
          This is the homepage where you can get an overview of your important updates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Counts</h3>
            <div className="flex flex-col gap-4">
              <div className="bg-blue-100 p-4 rounded-md">
                <h4 className="text-base md:text-lg font-medium text-blue-700">Total Riders</h4>
                <p className="text-lg md:text-xl font-bold text-blue-900">{ridersCount}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-md">
                <h4 className="text-base md:text-lg font-medium text-green-700">Total Products</h4>
                <p className="text-lg md:text-xl font-bold text-green-900">{productsCount}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-md">
                <h4 className="text-base md:text-lg font-medium text-yellow-700">Total Orders</h4>
                <p className="text-lg md:text-xl font-bold text-yellow-900">{ordersCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li><a href="/ProductsList" className="text-blue-500 hover:text-blue-700">View Products</a></li>
            <li><a href="/AddProducts" className="text-blue-500 hover:text-blue-700">Add New Product</a></li>
            <li><a href="/Reports" className="text-blue-500 hover:text-blue-700">View Reports</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
