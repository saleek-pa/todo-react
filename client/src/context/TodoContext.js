import { createContext, useState } from 'react';
import {
  makeGetRequest,
  makePostRequest,
  makePutRequest,
  makePatchRequest,
  makeDeleteRequest,
} from '../configs/Axios';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState({});
  const [openCreateInput, setOpenCreateInput] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await makeGetRequest(
        `/todos?priorities=${
          selectedPriorities.length > 0 ? selectedPriorities.join(',') : ''
        }&searchTerm=${searchTerm || ''}`
      );

      if (!response || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch todos');
      }

      setTodos(response?.data?.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addTodo = async (todo) => {
    try {
      const response = await makePostRequest('/todos', todo);
      if (response.status !== 201) {
        throw new Error(response.data.message || 'Error adding task');
      }
      fetchTodos();
    } catch (error) {
      throw error;
    }
  };

  const updateTodo = async (todoId, updatedTodo) => {
    try {
      const response = await makePutRequest(`/todos/${todoId}`, updatedTodo);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error updating task');
      }
      fetchTodos();
    } catch (error) {
      throw error;
    }
  };

  const toggleTodo = async (todoId) => {
    try {
      const response = await makePatchRequest(`/todos/${todoId}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error toggling task');
      }
      fetchTodos();
    } catch (error) {
      throw error;
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const response = await makeDeleteRequest(`/todos/${todoId}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error deleting task');
      }
      fetchTodos();
    } catch (error) {
      throw error;
    }
  };

  const assignTodoToUser = async (todoId, selectedUsers) => {
    try {
      const response = await makePostRequest(`/todos/${todoId}/assign`, { selectedUsers });
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error assigning user to task');
      }
      fetchTodos();
    } catch (error) {
      throw error;
    }
  };

  const value = {
    todos,
    setTodos,
    fetchTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    openCreateInput,
    setOpenCreateInput,
    selectedPriorities,
    setSelectedPriorities,
    searchTerm,
    setSearchTerm,
    assignTodoToUser,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
