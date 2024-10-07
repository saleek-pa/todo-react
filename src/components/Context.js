import { createContext, useState } from 'react';

export const TodoContext = createContext();

const initialData = [
  { id: 1, title: 'Task 1', date: '10/2/2024', time: '10:28', priority: '1', status: 'pending' },
  { id: 2, title: 'Task 2', date: '10/3/2024', time: '20:28', priority: '2', status: 'pending' },
  { id: 3, title: 'Task 3', date: '10/4/2024', time: '10:28', priority: '1', status: 'pending' },
  {
    id: 4,
    title: 'Task 4',
    date: '10/1/2024',
    time: '20:28',
    priority: '3',
    status: 'completed',
  },
  {
    id: 5,
    title: 'Task 5',
    date: '10/1/2024',
    time: '10:28',
    priority: '2',
    status: 'completed',
  },
];

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState(initialData);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);

  const addTodo = (todo) => {
    const updatedTodos = [{ ...todo, id: Date.now() }, ...todos];
    setTodos(updatedTodos);
    filterTodo(updatedTodos);
  };

  const updateTodo = (updatedTodo) => {
    const updatedTodos = todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo));
    setTodos(updatedTodos);
    filterTodo(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    filterTodo(updatedTodos);
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, status: todo.status === 'completed' ? 'pending' : 'completed' }
        : todo
    );
    setTodos(updatedTodos);
    filterTodo(updatedTodos);
  };

  const filterTodo = (updatedTodos, priorities = selectedPriorities) => {
    if (priorities.length === 0) {
      setFilteredTodos(updatedTodos);
    } else {
      setFilteredTodos(updatedTodos.filter((todo) => priorities.includes(todo.priority)));
    }
  };

  const value = {
    todos,
    selectedPriorities,
    setSelectedPriorities,
    filteredTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    filterTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
