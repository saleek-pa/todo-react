import { createContext, useState } from 'react';
import {
  makeDeleteRequest,
  makeGetRequest,
  makePatchRequest,
  makePostRequest,
  makePutRequest,
} from '../configs/Axios';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [openCreateInput, setOpenCreateInput] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [todos, setTodos] = useState({});
  const [user, setUser] = useState({});

  const fetchTodos = async () => {
    try {
      const response = await makeGetRequest(
        `/todos?priorities=${
          selectedPriorities.length > 0 ? selectedPriorities.join(',') : ''
        }&searchTerm=${searchTerm || ''}`
      );
      if (response?.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch todos');
      }
      setTodos(response?.data?.data);
      const userResponse = await getUserProfile();
      if (userResponse?.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch user details');
      }
      setUser(userResponse?.data?.data);
    } catch (error) {
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await makePostRequest('/users/register', formData);
      if (response.status !== 201) {
        throw new Error(response.data.message || 'Registration failed');
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await makePostRequest('/users/login', { email, password });
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Login failed');
      }
      localStorage.setItem('token', response.data.data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await makeGetRequest('/users');
      if (response.status !== 200) {
        throw new Error(response.data.message || 'User fetch failed');
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getUserProfile = async (userId) => {
    try {
      const response = await makeGetRequest(`/users/${userId}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'User fetch failed');
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (userId, updatedData) => {
    try {
      const response = await makePutRequest(`/users/${userId}`, updatedData);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Update profile failed');
      }
      fetchTodos();
      return response;
    } catch (error) {
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

  const reorderTodos = async (type, source, destination) => {
    try {
      const [removed] = todos[type]?.pendingTodos.splice(source.index, 1);
      todos[type]?.pendingTodos.splice(destination.index, 0, removed);

      const updatedTodos = todos[type]?.pendingTodos.concat(todos[type]?.completedTodos);
      const reorderedTodos = updatedTodos.map((todo, index) => ({
        _id: todo._id,
        order: index + 1,
      }));
      const response = await makePutRequest(`/todos/reorder`, { reorderedTodos });
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error reordering task');
      }
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

  const reorderSubtask = async (todo, source, destination) => {
    try {
      const [removed] = todo.subTasks.splice(source.index, 1);
      todo.subTasks.splice(destination.index, 0, removed);

      const reorderedSubtasks = todo.subTasks.map((subTask, index) => ({
        _id: subTask._id,
        order: index + 1,
      }));
      const response = await makePutRequest(`/todos/${todo._id}/subtasks/reorder`, {
        reorderedSubtasks,
      });
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error reordering subtask');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleOnDragEnd = (result, todo = {}) => {
    const { type, source, destination } = result;
    if (!destination) return;
    if (source.droppableId === 'pendingTodos') {
      reorderTodos(type, source, destination);
    }
    if (source.droppableId === 'subTasks') {
      reorderSubtask(todo, source, destination);
    }
  };

  const value = {
    login,
    register,
    user,
    fetchTodos,
    todos,
    setTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
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
    reorderSubtask,
    handleOnDragEnd,
    assignTodoToUser,
    getAllUsers,
    updateUserProfile,
    getUserProfile,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
