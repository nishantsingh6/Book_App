import React, { useState, useEffect } from 'react';
import DashBoard from '../common/DashBoard';
import { useNavigate } from 'react-router-dom';
import API from '../apiConnecter';
import { toast } from 'react-toastify';

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);

  const handleUpdate = (book) => {
    navigate("/admin/postBook", { state: { book } });
  };

  // Open modal instead of window.confirm
  const handleDelete = (bookId) => {
    setBookIdToDelete(bookId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Token missing");
        return;
      }

      const res = await API.delete(`/admin/delete/${bookIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        toast.success("Book deleted successfully");
        navigate(0); // Refresh the current route
      } else {
        toast.error("Failed to delete book");
      }
    } catch (error) {
      console.error(error?.response?.data || error.message);
      toast.error("Error deleting book");
    } finally {
      setIsModalOpen(false);
      setBookIdToDelete(null);
    }
  };

  return (
    <div>
      <DashBoard
        primaryText="Update"
        secText="Delete"
        func={handleUpdate}
        secFunc={handleDelete}
      />

      {/* Modal UI */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mt-2">Are you sure you want to delete this book?</p>
            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setBookIdToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashBoard;
