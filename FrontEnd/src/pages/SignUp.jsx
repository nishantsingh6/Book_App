import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import API from "../apiConnecter";

const SignUp = () => {
  const bgImgUrl = "https://res.cloudinary.com/dvhde2jl6/image/upload/v1747069014/BookApp/signUpBg_cc2eh4.jpg";

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true); // Start loading
    try {
      const res = await API.post("/signup", data);
      if (res.status === 201) {
        toast.success(res.data.message);
        navigate("/book/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg opacity-95"
        style={{
          backdropFilter: 'blur(8px)',
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        {/* Name Fields */}
        <div className="mb-6 flex space-x-4">
          <div className="flex-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 text-left">First Name</label>
            <input
              id="firstName"
              {...register('firstName', {
                required: 'First Name is required',
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
              })}
              placeholder="First Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1 text-left">{errors.firstName.message}</p>}
          </div>
          <div className="flex-1">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 text-left">Last Name</label>
            <input
              type="text"
              id="lastName"
              {...register('lastName', {
                required: 'Last Name is required',
                maxLength: { value: 50, message: 'Name cannot exceed 50 characters' }
              })}
              placeholder="Last Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1 text-left">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email Address is required' })}
            placeholder="Enter your email"
            aria-invalid={errors.email ? 'true' : 'false'}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>}
        </div>

        {/* Password with toggle */}
        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              maxLength: { value: 100, message: 'Password cannot exceed 100 characters' }
            })}
            placeholder="Enter your password"
            className="mt-1 block w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-[38px] right-3 text-sm text-blue-600 hover:underline focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1 text-left">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="mb-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : null}
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        {/* Login Link */}
        <p className="flex justify-center text-sm font-medium">
          Already have an account?{" "}
          <button onClick={() => navigate("/book/login")} className="text-blue-500 cursor-pointer ml-1">
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
