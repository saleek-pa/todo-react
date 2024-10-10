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

  const addSubTask = async (todoId, title) => {
    try {
      await makePostRequest(`/todos/${todoId}/subtasks`, { title });
      refetchTodos();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateSubTask = async (todoId, subTaskId, title) => {
    try {
      await makePutRequest(`/todos/${todoId}/subtasks/${subTaskId}`, { title });
      refetchTodos();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleSubtask = async (todoId, subTaskId) => {
    try {
      await makePatchRequest(`/todos/${todoId}/subtasks/${subTaskId}`);
      refetchTodos();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteSubtask = async (todoId, subTaskId) => {
    try {
      await makeDeleteRequest(`/todos/${todoId}/subtasks/${subTaskId}`);
      refetchTodos();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const reorderTodos = async (source, destination) => {
    try {
      const [removed] = todos.pendingTodos.splice(source.index, 1);
      todos.pendingTodos.splice(destination.index, 0, removed);

      const updatedTodos = todos.pendingTodos.concat(todos.completedTodos);
      const reorderedTodos = updatedTodos.map((todo, index) => ({
        _id: todo._id,
        order: index + 1,
      }));
      await makePutRequest(`/todos/reorder`, { reorderedTodos });
    } catch (error) {
      console.error('Error reordering task:', error);
    }
  };

  const value = {
    todos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refetchTodos,
    selectedPriorities,
    setSelectedPriorities,
    searchTerm,
    setSearchTerm,
    openCreateInput,
    setOpenCreateInput,
    addSubTask,
    updateSubTask,
    toggleSubtask,
    deleteSubtask,
    reorderTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
