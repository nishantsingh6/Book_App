import React, { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import API from '../apiConnecter';
import PlaceOrder from './PlaceOrder';

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const CartPage = () => {
  const [cartData, setCartData] = useState({ cartItems: [] });
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error('Token missing');

      const res = await API.get('/customer/getCart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res?.data?.message || 'Fetched cart items successfully');
      setCartData(res.data);
    } catch (error) {
      toast(error?.response?.data?.message || 'Error fetching cart items');
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const removeHandler = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error('Token missing');

      await API.delete(`/customer/removeCart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.info('Item removed from cart');
       setCartData((prev) => ({
         ...prev,
          cartItems: prev.cartItems.filter((item) => item._id !== cartItemId),
        }));
    } catch (error) {
      toast.error('Error removing item from cart');
      console.error('Remove error:', error);
    }
  };

  const totalAmount = useMemo(() => {
    return cartData.cartItems.reduce((total, item) => {
      return total + item.bookId.price * item.quantity;
    }, 0).toFixed(2);
  }, [cartData]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {cartData.cartItems && cartData.cartItems.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Cart Items */}
          <div className="w-full md:w-1/2 flex flex-col space-y-6">
            {cartData.cartItems.map((item, index) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-[30%]">
                    <img
                      src={item.bookId.image}
                      alt={item.bookId.title}
                      className="object-cover w-full h-40 rounded-md"
                    />
                  </div>
                  <div className="md:ml-8 mt-4 md:mt-0 w-full md:w-[70%] space-y-3">
                    <h2 className="text-xl font-semibold text-slate-800">{item.bookId.title}</h2>
                    <p className="text-sm text-slate-600">
                      {item.bookId.description?.split(' ').slice(0, 15).join(' ') + '...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-green-600">${item.bookId.price}</p>
                      <button
                        onClick={() => removeHandler(item._id)}
                        className="bg-red-200 group hover:bg-red-400 transition duration-300 rounded-full p-3"
                      >
                        <MdDelete className="text-red-800 group-hover:text-white h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col gap-5 mb-10">
              <h3 className="text-xl font-semibold text-green-800">YOUR CART</h3>
              <h2 className="text-4xl font-bold text-green-700">SUMMARY</h2>
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Total Items:</span> {cartData.cartItems.length}
              </p>
            </div>
            <div className="mt-auto">
              <p className="text-xl font-bold">
                <span className="text-gray-700 font-semibold">Total Amount:</span> ${totalAmount}
              </p>
              <button
                onClick={() => setShowPlaceOrder(true)}
                className="w-full mt-5 bg-green-700 hover:bg-purple-50 text-white hover:text-green-700 border-2 border-green-700 font-bold rounded-lg transition duration-300 p-3 text-lg"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Empty cart
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <h2 className="text-gray-700 font-semibold text-xl mb-4">Your cart is empty!</h2>
          <NavLink to="/book/dashboard">
            <button className="bg-green-600 hover:bg-purple-50 text-white font-semibold hover:text-green-700 border-2 border-green-600 rounded-lg px-10 py-3 transition">
              SHOP NOW
            </button>
          </NavLink>
        </div>
      )}

      {/* Modal for placing order */}
      <Modal isOpen={showPlaceOrder} onClose={() => setShowPlaceOrder(false)}>
        <PlaceOrder onClose={() => setShowPlaceOrder(false)} />
      </Modal>
    </div>
  );
};

export default CartPage;
