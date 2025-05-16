import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom'; 
import API from '../apiConnecter';
import { toast } from 'react-toastify';

const PostBook = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const book = location.state?.book || null;

  // Pre-fill form fields if we are editing
  useEffect(() => {
    if (book) {
      Object.entries(book).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [book, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Token missing");
        return;
      }

      if (book?._id) {
        const res = await API.put(`/admin/update/${book._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (res.status === 200) {
          toast.success("Book updated successfully");
          navigate("/admin/dashboard");
        } else {
          toast.error("Failed to update book");
        }
      } else {
        const res = await API.post("/admin/post", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        toast.success("Book posted successfully");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting book");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 space-y-6"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-700">{book ? "Update Book" : "Post Book"}</h1>

        {/* Image URL */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            <strong>Img URL:</strong>
          </label>
          <input
            type="text"
            id="image"
            {...register("image", { required: "Image URL is required" })}
            placeholder="Enter image URL"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            <strong>Title:</strong>
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Title"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            <strong>Author:</strong>
          </label>
          <input
            type="text"
            id="author"
            {...register("author", { required: "Author is required" })}
            placeholder="Author"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {errors.author && <p className="text-sm text-red-600">{errors.author.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            <strong>Description:</strong>
          </label>
          <input
            type="text"
            id="description"
            {...register("description", { required: "Description is required" })}
            placeholder="Description"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            <strong>Price:</strong>
          </label>
          <input
            type="number"
            id="price"
            {...register("price", { required: "Price is required" })}
            placeholder="Price"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            <strong>Genre:</strong>
          </label>
          <select
            id="genre"
            {...register("genre", { required: "Genre is required" })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">--Select--</option>
             <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="History">History</option>
            <option value="Biography">Biography</option>
            <option value="Science">Science</option>
          </select>
          {errors.genre && <p className="text-sm text-red-600">{errors.genre.message}</p>}
        </div>

        {/* Condition */}
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            <strong>Condition:</strong>
          </label>
          <select
            id="condition"
            {...register("condition", { required: "Condition is required" })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">--Select--</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Old">Old</option>
          </select>
          {errors.condition && <p className="text-sm text-red-600">{errors.condition.message}</p>}
        </div>

        {/* Edition */}
        <div>
          <label htmlFor="edition" className="block text-sm font-medium text-gray-700">
            <strong>Edition:</strong>
          </label>
          <input
            type="text"
            id="edition"
            {...register("edition", { required: "Edition is required" })}
            placeholder="Edition"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {errors.edition && <p className="text-sm text-red-600">{errors.edition.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            <strong>Status:</strong>
          </label>
          <select
            id="status"
            {...register("status", { required: "Status is required" })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">--Select--</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
          {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostBook;
