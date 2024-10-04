import { createContext, useState } from 'react';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([
    { id: 1, title: 'Task 1', date: '10/2/2024', time: '10:28', priority: "1", status: 'pending' },
    { id: 2, title: 'Task 2', date: '10/3/2024', time: '20:28', priority: "2", status: 'pending' },
    { id: 3, title: 'Task 3', date: '10/4/2024', time: '10:28', priority: "1", status: 'pending' },
    { id: 4, title: 'Task 4', date: '10/1/2024', time: '20:28', priority: "3", status: 'completed' },
    { id: 5, title: 'Task 5', date: '10/1/2024', time: '10:28', priority: "2", status: 'completed' },
  ]);

  const addTodo = (todo) => {
    setTodos((prevTodos) => [{ ...todo, id: Date.now() }, ...prevTodos]);
  };

  const updateTodo = (updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === 'completed' ? 'pending' : 'completed' }
          : todo
      )
    );
  };

  const value = {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
