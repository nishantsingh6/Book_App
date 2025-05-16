import React, { useState } from 'react';
import DashBoard from '../common/DashBoard';
import API from '../apiConnecter';
import { toast } from 'react-toastify';

const CustomerDashBoard = () => {
  const [dismissedBookIds, setDismissedBookIds] = useState([]);

  const handleToCart = async (book) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token missing");
        return;
      }

      await API.post("/customer/addCart", { bookId: book._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Added to cart successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error adding to cart");
    }
  };

  const removeFromView = (bookId) => {
    setDismissedBookIds((prev) => [...prev, bookId]);
    toast("Book removed successfully");
  };

  return (
    <DashBoard
      primaryText="Add to Cart"
      secText="Remove"
      func={handleToCart}
      secFunc={removeFromView}
      dismissedBookIds={dismissedBookIds} // Pass the list of removed books
    />
  );
};

export default CustomerDashBoard;
