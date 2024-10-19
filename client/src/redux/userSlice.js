import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { makeGetRequest, makePostRequest, makePutRequest } from '../configs/Axios';

const initialState = {
  user: {},
  loading: false,
  error: null,
};

const handlePending = (state, action) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const register = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const response = await makePostRequest('/users/register', formData);
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const login = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const response = await makePostRequest('/users/login', formData);
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Login failed');
    }
    localStorage.setItem('token', response.data.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const getAllUsers = createAsyncThunk('auth/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await makeGetRequest('/users');
    if (response.status !== 200) {
      throw new Error(response.data.message || 'User fetch failed');
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (userId = null, { rejectWithValue }) => {
    try {
      const response = await makeGetRequest(`/users/${userId}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch user details');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await makePutRequest(`/users/${userId}`, updatedData);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Update profile failed');
      }
      getUserProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle register
    builder.addCase(register.pending, handlePending);
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
    });
    builder.addCase(register.rejected, handleRejected);

    // Handle login
    builder.addCase(login.pending, handlePending);
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
    });
    builder.addCase(login.rejected, handleRejected);

    // Handle get all users
    builder.addCase(getAllUsers.pending, handlePending);
    builder.addCase(getAllUsers.fulfilled, (state, action) => (state.loading = false));
    builder.addCase(getAllUsers.rejected, handleRejected);

    // Handle get user profile
    builder.addCase(getUserProfile.pending, handlePending);
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
    });
    builder.addCase(getUserProfile.rejected, handleRejected);

    // Handle update user profile
    builder.addCase(updateUserProfile.pending, handlePending);
    builder.addCase(updateUserProfile.fulfilled, (state, action) => (state.loading = false));
    builder.addCase(updateUserProfile.rejected, handleRejected);
  },
});

export const { increment, decrement, incrementByAmount } = userSlice.actions;

export default userSlice.reducer;
