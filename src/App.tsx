import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { DoctorListPage } from "./pages/DoctorListPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FavoriteDoctorsPage } from "./pages/FavoriteDoctorsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DoctorListPage />,
  },
  {
    path: "/favorites",
    element: <FavoriteDoctorsPage />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  );
}

export default App;
