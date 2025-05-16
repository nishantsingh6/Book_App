import React, { useEffect, useState } from 'react';
import API from "../apiConnecter";
import { toast } from "react-toastify";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token')?.trim();
    const role = localStorage.getItem('role');

    let endpoint = role === 'Admin' ? "/admin/getAllOrders" : "/customer/getOrder";

    try {
      const response = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      const fetchedOrders = response.data.orders.map((order) => ({
        trackingId: order.trackingId,
        name: order?.user?.firstName,
        amount: order.amount,
        description: order.orderDescription,
        address: order.address,
        placedAt: new Date(order.createdAt).toLocaleString(),
      }));
      setOrders(fetchedOrders);
      toast.success("Orders fetched successfully");
    } catch (error) {
      console.log(error?.response?.data || "Error fetching orders");
      toast.error(error?.response?.data?.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Orders</h1>

      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div>
          {/* Parent div wrapping both views */}
          <div className="space-y-4 sm:hidden">
            {/* Card view for small screens */}
            {orders.map((order, index) => (
              <div key={index} className="border p-4 rounded-md shadow-md">
                <div>
                  <strong>Tracking ID:</strong> {order.trackingId}
                </div>
                <div>
                  <strong>Name:</strong> {order.name}
                </div>
                <div>
                  <strong>Amount:</strong> {order.amount}
                </div>
                <div>
                  <strong>Description:</strong> {order.description}
                </div>
                <div>
                  <strong>Address:</strong> {order.address}
                </div>
                <div>
                  <strong>Placed At:</strong> {order.placedAt}
                </div>
              </div>
            ))}
          </div>

          {/* Table view for larger screens */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Tracking ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">Placed At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{order.trackingId}</td>
                    <td className="border px-4 py-2">{order.name}</td>
                    <td className="border px-4 py-2">{order.amount}</td>
                    <td className="border px-4 py-2">{order.description}</td>
                    <td className="border px-4 py-2">{order.address}</td>
                    <td className="border px-4 py-2">{order.placedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
