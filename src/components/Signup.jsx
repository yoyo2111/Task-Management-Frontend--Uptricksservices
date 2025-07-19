import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import toast from "react-hot-toast";

export const Signup = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate function

  const {
    register,
    handleSubmit,
  } = useForm();

  const signupUser = async (data) => {
    console.log("Form Data:", data);
    toast.loading("Creating Account...");

    try {
      const URL = "http://localhost:5500/api/v1/auth/signup";
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const responseData = await response.json();
      toast.dismiss();

      if (response.ok) {
        toast.success("Signup successful! 🎉");
        console.log("Signup Successful:", responseData);
        toast.success("Please Login Now!");

        // ✅ Navigate to Home Page after successful signup
        navigate("/login");
      } else {
        toast.error(responseData.message || "Signup failed! Try again");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Signup failed");
      console.log("Signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Create an Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(signupUser)}>
          <div>
            <label className="text-left block text-gray-700 font-semibold">First Name</label>
            <input
              type="text"
              {...register("firstName", { required: true })}
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-left block text-gray-700 font-semibold">Last Name</label>
            <input
              type="text"
              {...register("lastName", { required: true })}
              placeholder="Enter your last name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-left block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-left block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-left block text-gray-700 font-semibold">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", { required: true })}
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};