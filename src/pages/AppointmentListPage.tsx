import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Search, Filter } from "lucide-react";
import {
  selectAppointments,
  Appointment,
  cancelAppointment,
  removeAppointment,
} from "../redux/slices/AppointmentSlice";
import { RootState } from "../redux/store";
import {
  Doctor,
  fetchDoctors,
  selectAllDoctors,
} from "../redux/slices/DoctorSlice";
import {
  Button,
  Group,
  Title,
  Container,
  TextInput,
  MultiSelect,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import RescheduleModal from "../components/form/Reschedule";
import NewAppointmentModal from "../components/form/NewAppointment";
import FilterDrawer from "../components/ui/FilterDrawer";
import AppointmentCalendar from "../components/ui/AppointmentCalender";
import AppointmentList from "../components/ui/AppointmentList";
import KanbanAppointmentBoard from "../components/ui/AppointmentKanban";

const AppointmentManagementSystem: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const appointments = useSelector((state: RootState) =>
    selectAppointments(state)
  );
  const doctors: Doctor[] = useSelector(selectAllDoctors);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "grid">(
    "list"
  );
  const [rescheduleModalOpened, setRescheduleModalOpened] = useState(false);

  const [
    filterDrawerOpened,
    { open: openFilterDrawer, close: closeFilterDrawer },
  ] = useDisclosure(false);

  const [filters, setFilters] = useState({
    selectedDoctors: [] as string[],
    selectedDate: null as Date | null,
    selectedTimeRange: [null, null] as [Date | null, Date | null],
    showCancelled: false,
  });

  // Search filter criteria options
  const filterOptions = [
    { value: "doctorName", label: "Doctor Name" },
    { value: "patientName", label: "Patient Name" },
    { value: "description", label: "Description" },
  ];

  // State to manage active search filters
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "doctorName",
    "patientName",
    "description",
  ]);

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);

    const doctor = doctors.find((doc) => doc.id === appointment.doctorId);
    const doctorName = doctor ? doctor.name.toLowerCase() : "";

    const matchesSearch =
      (activeFilters.includes("doctorName") &&
        doctorName.includes(searchQuery.toLowerCase())) ||
      (activeFilters.includes("patientName") &&
        appointment.patientName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (activeFilters.includes("description") &&
        appointment.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    const matchesDoctor =
      filters.selectedDoctors.length === 0 ||
      filters.selectedDoctors.includes(appointment.doctorId);

    const matchesDate =
      !filters.selectedDate ||
      appointmentDate.toDateString() === filters.selectedDate.toDateString();

    const matchesTimeRange =
      !filters.selectedTimeRange[0] ||
      !filters.selectedTimeRange[1] ||
      (new Date(`1970-01-01T${appointment.time}`).getTime() >=
        filters.selectedTimeRange[0]?.getTime() &&
        new Date(`1970-01-01T${appointment.time}`).getTime() <=
          filters.selectedTimeRange[1]?.getTime());

    const matchesCancelled = filters.showCancelled || !appointment.cancelled;

    return (
      matchesSearch &&
      matchesDoctor &&
      matchesDate &&
      matchesTimeRange &&
      matchesCancelled
    );
  });

  const handleCancel = (id: string) => {
    dispatch(cancelAppointment(id));
  };

  const handleRemove = (id: string) => {
    dispatch(removeAppointment(id));
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpened(true);
  };

  const closeModal = () => {
    setRescheduleModalOpened(false);
    setSelectedAppointment(null);
  };

  const handleApplyFilters = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <Container size="xl" py="xl">
      <Group align="apart" mb="xl">
        <Title order={1}>Appointment Management</Title>
        <Group>
          <Button onClick={() => setIsNewAppointmentModalOpen(true)}>
            <Calendar size={14} /> New Appointment
          </Button>
          <Button onClick={openFilterDrawer} variant="outline">
            <Filter size={14} /> Filters
          </Button>
        </Group>
      </Group>

      <TextInput
        placeholder="Search appointments..."
        leftSection={<Search size={14} />}
        mb="md"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
      />

      <MultiSelect
        data={filterOptions}
        value={activeFilters}
        onChange={setActiveFilters}
        placeholder="Select search filters"
        label="Search Criteria"
        mb="md"
        clearable
      />

      <Group align="apart" mb="md">
        <Button
          variant={viewMode === "list" ? "filled" : "outline"}
          size="xs"
          onClick={() => setViewMode("list")}
        >
          List
        </Button>
        <Button
          variant={viewMode === "calendar" ? "filled" : "outline"}
          size="xs"
          onClick={() => setViewMode("calendar")}
        >
          Calendar
        </Button>
        <Button
          variant={viewMode === "grid" ? "filled" : "outline"}
          size="xs"
          onClick={() => setViewMode("grid")}
        >
          Grid
        </Button>
      </Group>

      {viewMode === "list" ? (
        <AppointmentList
          appointments={filteredAppointments}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
          onRemove={handleRemove}
        />
      ) : viewMode === "grid" ? (
        <KanbanAppointmentBoard onReschedule={handleReschedule} />
      ) : (
        <AppointmentCalendar appointments={filteredAppointments} />
      )}

      <FilterDrawer
        opened={filterDrawerOpened}
        onClose={closeFilterDrawer}
        doctors={doctors}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />

      <NewAppointmentModal
        opened={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
        doctors={doctors}
      />

      <RescheduleModal
        opened={rescheduleModalOpened}
        onClose={closeModal}
        appointment={selectedAppointment}
        doctors={doctors}
      />
    </Container>
  );
};

export default AppointmentManagementSystem;
