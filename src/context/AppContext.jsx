import { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);

    
    // async function fetchTasks(userEmail) {
    //     if (!userEmail) {
    //         console.error("User email is required to fetch tasks");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const response = await fetch("http://localhost:5500/api/v1/task/getTasks", {
    //             method: "POST", 
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ user: userEmail }), 
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }

    //         const data = await response.json(); 

    //         setTasks(data.tasks || []);
    //     } catch (error) {
    //         console.error("❌ Failed to fetch tasks:", error);
    //         setTasks([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const value = {
        user,
        setUser,
        loading,
        setLoading,
        tasks,
        setTasks,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}