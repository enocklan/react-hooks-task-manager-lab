
import { createContext, useEffect, useState } from "react";

export const TaskContext = createContext();

const API_URL = "http://localhost:6001/tasks";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // GET: Load tasks from the backend
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  // POST: Add a task
  async function addTask(title) {
    const temporaryId = Date.now();

    const newTask = {
      id: temporaryId,
      title: title,
      completed: false,
    };

    // Display the task immediately
    setTasks((currentTasks) => [...currentTasks, newTask]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          completed: false,
        }),
      });

      const savedTask = await response.json();

      // Replace the temporary task with the backend task
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === temporaryId ? savedTask : task
        )
      );
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  // PATCH: Mark a task complete or undo completion
  async function toggleComplete(id) {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    const updatedTask = {
      ...task,
      completed: !task.completed,
    };

    // Update the UI immediately
    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === id ? updatedTask : item
      )
    );

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: updatedTask.completed,
        }),
      });

      const savedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === id ? savedTask : item
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleComplete,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
