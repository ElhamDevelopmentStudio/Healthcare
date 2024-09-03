import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Doctor {
  id: string;
  image: string;
  name: string;
  specialty: string;
  description: string;
  badges: { icon: React.ReactNode; label: string }[];
  availability: { day: string; hours: string[] }[];
  price: number;
  bio?: string;
  qualifications?: string[];
  phoneNumber?: string;
  location?: string;
  email?: string;
}

interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  status: "idle",
  error: null,
};

export const fetchDoctors = createAsyncThunk<Doctor[]>(
  "doctors/fetchDoctors",
  async () => {
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_DOCTOR_API}/doctors`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }
);

export const fetchDoctorById = createAsyncThunk<Doctor, string>(
  "doctors/fetchDoctorById",
  async (doctorId) => {
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_DOCTOR_API}/doctor/${doctorId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }
);

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(fetchDoctorById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default doctorSlice.reducer;

export const selectAllDoctors = (state: RootState) => state.doctors.doctors;
export const selectSelectedDoctor = (state: RootState) =>
  state.doctors.selectedDoctor;
export const selectDoctorsStatus = (state: RootState) => state.doctors.status;
export const selectDoctorsError = (state: RootState) => state.doctors.error;
