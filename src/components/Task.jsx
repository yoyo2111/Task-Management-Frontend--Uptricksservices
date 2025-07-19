import React, { useState } from "react";
import toast from "react-hot-toast";

export const Task = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newStatus, setNewStatus] = useState(task.status); // ✅ Track selected status

    // ✅ Function to update task status
    const updateTaskStatus = async () => {
        try {
            const response = await fetch("http://localhost:5500/api/v1/task/updateTask", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ taskId: task.taskId, status: newStatus }), // ✅ Send taskId & new status
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Task status updated successfully!");
                setIsEditing(false); // ✅ Close edit mode
                window.location.reload(); // ✅ Refresh the task list
            } else {
                toast.error(`Failed to update task: ${data.message}`);
            }
        } catch (error) {
            console.error("Failed to update task:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    // ✅ Function to delete task
    const deleteTask = async (taskId) => {
        try {
            const response = await fetch("http://localhost:5500/api/v1/task/deleteTask", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ taskId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Task deleted successfully!");
                window.location.reload();
            } else {
                toast.error(`Failed to delete task: ${data.message}`);
            }
        } catch (error) {
            console.error("Failed to delete task:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <tr className="text-center hover:bg-gray-100">
            <td className="border border-gray-300 px-2 sm:px-4 py-2">{task.taskId}</td>
            <td className="border border-gray-300 px-2 sm:px-4 py-2">{task.title}</td>
            <td className="border border-gray-300 px-2 sm:px-4 py-2">{task.description}</td>
            
            {/* ✅ If editing, show dropdown, else show status text */}
            <td className="border border-gray-300 px-2 sm:px-4 py-2">
                {isEditing ? (
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="px-2 py-1 border rounded-md"
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                ) : (
                    <span className={`px-2 sm:px-3 py-1 rounded-md ${task.status === "Completed" ? "bg-green-500" : "bg-yellow-500"} text-white`}>
                        {task.status}
                    </span>
                )}
            </td>

            <td className="flex items-center justify-center border border-gray-300 px-2 sm:px-4 py-2 space-x-2">
                {isEditing ? (
                    <>
                        <button
                            className="px-2 py-1 bg-green-500 text-white rounded-md cursor-pointer"
                            onClick={updateTaskStatus}
                        >
                            Save
                        </button>
                        <button
                            className="px-2 py-1 bg-gray-500 text-white rounded-md cursor-pointer"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                )}
                <button
                    className="px-2 py-1 bg-red-500 text-white rounded-md cursor-pointer"
                    onClick={() => deleteTask(task.taskId)}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};