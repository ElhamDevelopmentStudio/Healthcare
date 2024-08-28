import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  patientAge: number;
  description: string;
  date: string;
  time: string;
  cancelled: boolean;
}

interface AppointmentState {
  appointments: Appointment[];
}

const initialState: AppointmentState = {
  appointments: [],
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    cancelAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(
        (appointment) => appointment.id !== action.payload
      );
    },
    rescheduleAppointment: (
      state,
      action: PayloadAction<{ id: string; date: string; time: string }>
    ) => {
      const appointment = state.appointments.find(
        (app) => app.id === action.payload.id
      );
      if (appointment) {
        appointment.date = action.payload.date;
        appointment.time = action.payload.time;
      }
    },
  },
});

export const { addAppointment, cancelAppointment, rescheduleAppointment } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;

export const selectAppointments = (state: RootState) =>
  state.appointments.appointments;
