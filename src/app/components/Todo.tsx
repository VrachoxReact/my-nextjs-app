"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    createUser().then(() => fetchTodos());
  }, []);

  const createUser = async () => {
    try {
      const response = await axios.post("/api/auth", {
        email: "user@example.com",
        password: "password123",
      });
      setUserId(response.data.userId);
    } catch (error: any) {
      console.error("Error creating/logging in user:", error);
    }
  };

  const fetchTodos = async () => {
    const response = await axios.get("/api/todos");
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim() === "" || !userId) return;
    await axios.post("/api/todos", { title: newTodo, userId });
    setNewTodo("");
    fetchTodos();
  };

  const updateTodo = async (id: number, completed: boolean) => {
    await axios.put("/api/todos", { id, completed });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`/api/todos?id=${id}`);
    fetchTodos();
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const saveEdit = async () => {
    if (editingTodo) {
      await axios.put("/api/todos", {
        id: editingTodo.id,
        title: editingTodo.title,
      });
      setEditingTodo(null);
      fetchTodos();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow border rounded-l px-4 py-2"
          placeholder="Add a new todo"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => updateTodo(todo.id, !todo.completed)}
              className="mr-2"
            />
            {editingTodo && editingTodo.id === todo.id ? (
              <input
                type="text"
                value={editingTodo.title}
                onChange={(e) =>
                  setEditingTodo({ ...editingTodo, title: e.target.value })
                }
                className="flex-grow border rounded px-2 py-1 mr-2"
              />
            ) : (
              <span
                className={`flex-grow ${todo.completed ? "line-through" : ""}`}
              >
                {todo.title}
              </span>
            )}
            {editingTodo && editingTodo.id === todo.id ? (
              <button
                onClick={saveEdit}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => startEditing(todo)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
