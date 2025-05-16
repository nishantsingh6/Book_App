import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API from '../apiConnecter';
import { toast } from 'react-toastify';

const PlaceOrder = ({ onClose }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true); // Start loading when submitting
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Token missing');
        setLoading(false); // Stop loading if token is missing
        return;
      }

      const res = await API.post('/customer/placeOrder', {
        address: data.address,
        description: data.description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res?.data?.message);
      navigate('/book/dashboard/orders');
      onClose(); // Close the modal after successful order
    } catch (error) {
      console.log('Error placing order:', error);
      toast.error('Error placing order');
    } finally {
      setLoading(false); // Stop loading after request is done
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center mb-4">Place Your Order</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-gray-700 text-lg font-semibold mb-2">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter your address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && <p className="text-red-500 text-sm mt-2">{errors.address.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-gray-700 text-lg font-semibold mb-2">Description</label>
          <input
            type="text"
            id="description"
            placeholder="Add any special instructions"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('description')}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-md ${loading ? 'bg-blue-300 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
