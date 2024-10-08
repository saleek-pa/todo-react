import { createContext, useState } from 'react';
import useFetch from '../hooks/useFetch';
import {
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  makePutRequest,
} from '../configs/Axios';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [openCreateInput, setOpenCreateInput] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefetch, setIsRefetch] = useState(false);

  const { data: todos, error } = useFetch(
    `/todos?priorities=${
      selectedPriorities.length > 0 ? selectedPriorities.join(',') : ''
    }&searchTerm=${searchTerm || ''}`,
    isRefetch
  );
  if (error) {
    console.error('Error fetching todos:', error);
  }

  const refetchTodos = () => {
    setIsRefetch((prev) => !prev);
  };

  const addTodo = async (todo) => {
    try {
      await makePostRequest('/todos', todo);
      refetchTodos();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTodo = async (todoId, updatedTodo) => {
    try {
      await makePutRequest(`/todos/${todoId}`, updatedTodo);
      refetchTodos();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleTodo = async (todoId) => {
    try {
      await makePatchRequest(`/todos/${todoId}`);
      refetchTodos();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await makeDeleteRequest(`/todos/${todoId}`);
      refetchTodos();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const value = {
    todos,
    selectedPriorities,
    setSelectedPriorities,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    searchTerm,
    setSearchTerm,
    refetchTodos,
    openCreateInput,
    setOpenCreateInput,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
