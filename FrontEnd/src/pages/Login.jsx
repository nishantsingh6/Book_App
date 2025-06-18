import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../apiConnecter";

const Login = () => {

  const bgImgUrl = "https://res.cloudinary.com/dvhde2jl6/image/upload/v1747069559/BookApp/loginBg_1_pehvbr.jpg";

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await API.post("/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      const userRole = res.data.user.role;

      toast.success("Login Successful");

      if (userRole === "Admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "Customer") {
        navigate("/book/dashboard");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-end min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg opacity-95 mr-4"
        style={{
          backdropFilter: "blur(8px)",
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email Address is required",
            })}
            placeholder="Enter your email"
            aria-invalid={errors.email ? "true" : "false"}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              maxLength: {
                value: 100,
                message: "Password cannot exceed 100 characters",
              },
            })}
            placeholder="Enter your password"
            className="mt-1 block w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-[38px] right-3 text-sm text-blue-600 hover:underline focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 text-left">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button with Spinner */}
        <div className="mb-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isLoading && (
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
            )}
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="flex justify-center text-sm font-medium">
          Don't have an account?{" "}
          <button onClick={() => { navigate("/book/signup"); }} className="text-blue-500 cursor-pointer ml-1">
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
