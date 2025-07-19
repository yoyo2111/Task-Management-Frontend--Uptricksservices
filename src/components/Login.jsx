import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

export const Login = () => {

const navigate = useNavigate();

const { user,setUser } = useContext(AppContext);

  const {
    register, 
    handleSubmit,
  } = useForm();

  const loginUser = async (data) => {
    // console.log("Form Data:", data);
    toast.loading("Validating Credentials...");

    try {
      const URL = "http://localhost:5500";
      const response = await fetch(`${URL}/api/v1/auth/login`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({
          email: data.email, 
          password: data.password,
        }),
      });

      const responseData = await response.json();

      toast.dismiss();
      if (response.ok) {
        setUser(responseData.user.email);
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("user", JSON.stringify(responseData.user.email));
        toast.success("Login successful!");
        console.log("Login Successful:", responseData);
        console.log(user);
        navigate("/");
      } else {
        toast.error(responseData.message || "Login failed");
        console.log("Login Error:", responseData);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Login failed");
      console.log("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Login to Task Management
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(loginUser)}>

          <div>
            <label className="text-left block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              {...register("email", { required: true })} 
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-left block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              {...register("password", { required: true })} // ✅ Bind to react-hook-form
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};