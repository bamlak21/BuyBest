import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types/auth';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('user');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    checkAuth: (state) => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
        } catch {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem('user');
        }
      }
    },
  },
});

export const { login, logout, setLoading, checkAuth } = authSlice.actions;
export default authSlice.reducer;