import { createContext, useContext } from 'react';
import {
  makePostRequest,
  makePutRequest,
  makePatchRequest,
  makeDeleteRequest,
} from '../configs/Axios';
import { TodoContext } from './TodoContext';

export const SubtaskContext = createContext();

export const SubtaskProvider = ({ children }) => {
  const { fetchTodos } = useContext(TodoContext);

  const addSubTask = async (todoId, title) => {
    try {
      const response = await makePostRequest(`/todos/${todoId}/subtasks`, { title });
      if (response.status !== 201) {
        throw new Error(response.data.message || 'Error adding subtask');
      }
      fetchTodos();
    } catch (error) {
      throw error;
    }
  };

  const updateSubTask = async (todoId, subTaskId, title) => {
    try {
      const response = await makePutRequest(`/todos/${todoId}/subtasks/${subTaskId}`, { title });
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error updating subtask');
      }
      fetchTodos();
    } catch (error) {
      throw error;
    }
  };

  const toggleSubtask = async (todoId, subTaskId) => {
    try {
      const response = await makePatchRequest(`/todos/${todoId}/subtasks/${subTaskId}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error toggling subtask');
      }
      fetchTodos();
    } catch (error) {
      throw error;
    }
  };

  const deleteSubtask = async (todoId, subTaskId) => {
    try {
      const response = await makeDeleteRequest(`/todos/${todoId}/subtasks/${subTaskId}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error deleting subtask');
      }
      fetchTodos();
    } catch (error) {
      throw error;
    }
  };

  const value = {
    addSubTask,
    updateSubTask,
    toggleSubtask,
    deleteSubtask,
  };

  return <SubtaskContext.Provider value={value}>{children}</SubtaskContext.Provider>;
};
