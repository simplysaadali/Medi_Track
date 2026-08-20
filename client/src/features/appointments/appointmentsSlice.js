import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/appointments");
      return data.appointments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg ?? "Failed");
    }
  }
);

export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/appointments", body);
      return data.appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg ?? "Failed");
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  "appointments/cancel",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/appointments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg ?? "Failed");
    }
  }
);

// Staff-only thunks
export const fetchAllForStaff = createAsyncThunk(
  "appointments/fetchAllForStaff",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/staff/appointments");
      return data.appointments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg ?? "Failed");
    }
  }
);

export const updateStatus = createAsyncThunk(
  "appointments/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/staff/appointments/${id}/status`, { status });
      return data.appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg ?? "Failed");
    }
  }
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    items: [],       // patient's own list
    staffItems: [],   // full clinic list
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // patient: fetch
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // patient: create
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // patient: cancel
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a._id !== action.payload);
      })
      // staff: fetch all
      .addCase(fetchAllForStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllForStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffItems = action.payload;
      })
      .addCase(fetchAllForStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // staff: update status
      .addCase(updateStatus.fulfilled, (state, action) => {
        const idx = state.staffItems.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) state.staffItems[idx] = action.payload;
      });
  },
});

export default appointmentsSlice.reducer;