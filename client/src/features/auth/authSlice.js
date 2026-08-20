import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", body);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg ?? "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", body);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg ?? "Login failed");
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me");
      return data.user;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await api.post("/auth/logout");
    return true;
});

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  booted: false, // has /me answered yet? stops the login page flashing
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      ((state.user = null),
        (state.isAuthenticated = false),
        (state.loading = false),
        (state.error = null));
    },
    forceLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.booted = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.booted = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, forceLogout, clearUser } = authSlice.actions;
export default authSlice.reducer;
