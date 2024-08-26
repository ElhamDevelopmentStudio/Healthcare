import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Doctor } from "./redux/slices/DoctorSlice";
import { IconStethoscope } from "@tabler/icons-react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { DoctorListPage } from "./pages/DoctorListPage";

const mockDoctor: Doctor = {
  id: "1",
  image:
    "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  name: "Dr. Jane Smith",
  specialty: "Cardiologist",
  description:
    "Dr. Jane Smith is a board-certified cardiologist with over 15 years of experience. She specializes in preventive cardiology and heart disease management.",
  badges: [
    { icon: <IconStethoscope size={14} />, label: "Heart Disease" },
    { icon: <IconStethoscope size={14} />, label: "Hypertension" },
    { icon: <IconStethoscope size={14} />, label: "Cholesterol Management" },
  ],
};

function App() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <DoctorListPage />
      </MantineProvider>
    </Provider>
  );
}

export default App;
