import { createContext, useState } from 'react';
import { makePostRequest, makeGetRequest, makePutRequest } from '../configs/Axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

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

  const getUserProfile = async (userId = null) => {
    try {
      const response = await makeGetRequest(`/users/${userId}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch user details');
      }
      setUser(response?.data?.data);
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
      getUserProfile();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    login,
    register,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
