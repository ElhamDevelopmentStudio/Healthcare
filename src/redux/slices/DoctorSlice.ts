import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Doctor {
  id: string;
  image: string;
  name: string;
  specialty: string;
  description: string;
  badges: { icon: React.ReactNode; label: string }[];
  availability: string[];
  price: number;
}

interface DoctorState {
  doctors: Doctor[];
  favorites: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DoctorState = {
  doctors: [],
  favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
  status: "idle",
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async () => {
    // Replace this with your actual API call
    const response = await fetch("https://api.example.com/doctors");
    const data = await response.json();
    return data;
  }
);

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctors: (state, action: PayloadAction<Doctor[]>) => {
      state.doctors = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const doctorId = action.payload;
      const index = state.favorites.indexOf(doctorId);
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(doctorId);
      }
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchDoctors.fulfilled,
        (state, action: PayloadAction<Doctor[]>) => {
          state.status = "succeeded";
          state.doctors = action.payload;
        }
      )
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setDoctors, toggleFavorite } = doctorSlice.actions;
export default doctorSlice.reducer;

export const selectAllDoctors = (state: { doctors: DoctorState }) =>
  state.doctors.doctors;
