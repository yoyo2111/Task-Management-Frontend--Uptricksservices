import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "./Task";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export const TaskSheet = () => {
  const navigate = useNavigate();
  const { user, setUser, tasks, setTasks } = useContext(AppContext);
  const [taskData, setTaskData] = useState({
    taskId: "",
    title: "",
    description: "",
    status: "Pending",
  });

  async function fetchTasks(userEmail) {
    if (!userEmail) {
      console.error("User email is required to fetch tasks");
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/api/v1/task/getTasks", {
        method: "POST", // ✅ Corrected method to POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userEmail }), // ✅ Send email in body
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      console.log("Fetched tasks:", data.tasks);
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        let parsedUser = JSON.parse(storedUser);

        // ✅ Fix: Remove extra quotes & slashes from email
        if (typeof parsedUser === "string") {
          parsedUser = parsedUser.replace(/^"(.*)"$/, "$1").replace(/\\/g, "");
          parsedUser = { email: parsedUser.trim() };
        } else if (parsedUser.email) {
          parsedUser.email = parsedUser.email.replace(/^"(.*)"$/, "$1").replace(/\\/g, "").trim();
        }

        console.log("✅ Cleaned Parsed User:", parsedUser);
        setUser(parsedUser);
        fetchTasks(parsedUser.email);
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        setUser(null);
      }
    }
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskData.taskId || !taskData.title || !taskData.description) {
      toast.error("Please fill all fields before adding a task.");
      return;
    }

    if (!user?.email) {
      toast.error("User not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/api/v1/task/createTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.email, // ✅ Use cleaned email
          taskId: taskData.taskId,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Task added successfully!");
        fetchTasks(user.email); // ✅ Refresh tasks
        setTaskData({ taskId: "", title: "", description: "", status: "Pending" });
      } else {
        toast.error(`Failed to add task: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <nav className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
            Task Management System - Uptricksservices Pvt. Ltd.
          </h1>
          <div className="flex sm:flex-col sm:space-y-2 sm:space-x-0 space-x-4">
            {user ? (
              <button
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700"
                onClick={handleSignout}
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  className="cursor-pointer px-4 py-2 bg-white text-blue-600 font-semibold rounded-md shadow-md hover:bg-gray-200"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="cursor-pointer px-4 py-2 bg-red-800 text-white font-semibold rounded-md shadow-md hover:bg-blue-700"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="container mx-auto mt-8 px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 sm:min-w-[600px]">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-300 px-2 sm:px-4 py-2">Task ID</th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">Title</th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">Description</th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">Status</th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">Actions</th>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">
                  <input
                    type="text"
                    placeholder="Enter Task ID"
                    value={taskData.taskId}
                    onChange={(e) => setTaskData({ ...taskData, taskId: e.target.value })}
                    className="w-full px-2 py-1 border rounded-md"
                  />
                </td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">
                  <input
                    type="text"
                    placeholder="Enter title"
                    value={taskData.title}
                    onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                    className="w-full px-2 py-1 border rounded-md"
                  />
                </td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={taskData.description}
                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                    className="w-full px-2 py-1 border rounded-md"
                  />
                </td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2">
                  <select
                    value={taskData.status}
                    onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                    className="w-full px-2 py-1 border rounded-md"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center">
                  <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700" onClick={handleAddTask}>
                    + Add Task
                  </button>
                </td>
              </tr>
            </thead>
            <tbody>{tasks.map((task) => <Task key={task.taskId} task={task} />)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};