import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import doctorReducer from "./slices/DoctorSlice";
import favoriteReducer from "./slices/FavoriteSlice";
import appointmentReducer from "./slices/AppointmentSlice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["favorites", "appointments"],
};

const persistedFavoriteReducer = persistReducer(persistConfig, favoriteReducer);
const persistedAppointmentReducer = persistReducer(
  persistConfig,
  appointmentReducer
);

export const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    favorites: persistedFavoriteReducer,
    appointments: persistedAppointmentReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
