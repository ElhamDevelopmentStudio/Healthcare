import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { DoctorListPage } from "./pages/DoctorListPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { FavoriteDoctorsPage } from "./pages/FavoriteDoctorsPage";
import ErrorBoundary from "./pages/ErrorBoundary";
import { PersistGate } from "redux-persist/integration/react";
import { DoctorDetailPage } from "./pages/DoctorDetailPage";
import { Toaster } from "react-hot-toast";
import AppointmentList from "./pages/AppointmentListPage";
import Navbar from "./components/Navbar";

const Layout = () => (
  <div>
    <Navbar />
    <main style={{ padding: "20px", marginTop: "60px" }}>
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <DoctorListPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/doctor/:id",
        element: <DoctorDetailPage />,
      },
      {
        path: "/favorites",
        element: <FavoriteDoctorsPage />,
      },
      { path: "/appointments", element: <AppointmentList /> },
    ],
  },
  { path: "*", element: <ErrorBoundary /> },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MantineProvider>
          <Toaster />
          <RouterProvider router={router} />
        </MantineProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;