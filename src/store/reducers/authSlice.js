import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let userData = null;

      if (email === 'manager@gmail.com' && password === 'manager') {
        userData = { id: 1, name: 'Pratham Bhardwaj', email, role: 'manager', avatar: 'P' };
      } else if (email === 'employee@gmail.com' && password === 'employee') {
        userData = { id: 2, name: 'Alice Johnson', email, role: 'employee', avatar: 'A' };
      } else if (email === 'admin@gmail.com' && password === 'admin') {
        userData = { id: 3, name: 'Super Admin', email, role: 'admin', avatar: 'S' };
      }

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else {
        return rejectWithValue('Invalid credentials');
      }
    } catch {
      return rejectWithValue('Server Error');
    }
  }
);

let storedUser = null;
try {
  storedUser = JSON.parse(localStorage.getItem('user'));
} catch {
  storedUser = null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    isAuthenticated: !!storedUser,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
    },

    clearError: (state) => {
      state.error = null;
    },

    loginByEmail: (state, action) => {
      const { email, allEmployees } = action.payload;
      const foundUser = allEmployees.find(
        (emp) => emp.email.toLowerCase() === email.toLowerCase()
      );

      if (foundUser) {
        state.user = foundUser;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(foundUser));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, loginByEmail } = authSlice.actions;
export default authSlice.reducer;
