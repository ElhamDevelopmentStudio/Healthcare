import React, { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { useAppDispatch } from "../../../redux/store";
import {
  addAppointment,
  Appointment,
} from "../../../redux/slices/AppointmentSlice";
import { Doctor } from "../../../redux/slices/DoctorSlice";
import {
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Select,
  Group,
  Stack,
  Modal,
  Tabs,
  Badge,
} from "@mantine/core";
import { Clock } from "lucide-react";

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  doctor?: Doctor;
  doctors?: Doctor[];
  parentComponent: "AppointmentManagementSystem" | "DoctorDetailPage";
}

interface FormValues {
  doctorId: string;
  patientName: string;
  patientAge: number;
  description: string;
  date: string;
  time: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  isOpen,
  onClose,
  doctor,
  doctors,
  parentComponent,
}) => {
  const dispatch = useAppDispatch();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>(
    doctor
  );
  const [availableDates, setAvailableDates] = useState<{
    [key: string]: string[];
  }>({
    thisWeek: [],
    nextWeek: [],
  });
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const form = useForm<FormValues>({
    initialValues: {
      doctorId: doctor?.id || "",
      patientName: "",
      patientAge: 18,
      description: "",
      date: "",
      time: "",
    },
    validate: {
      doctorId: (value) => (value ? null : "Please select a doctor"),
      patientName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      patientAge: (value) =>
        value < 1 ? "Age must be a positive number" : null,
      description: (value) =>
        value.length < 10
          ? "Description must be at least 10 characters long"
          : null,
      date: (value) => (value ? null : "Please select a date"),
      time: (value) => (value ? null : "Please select a time"),
    },
  });

  useEffect(() => {
    if (selectedDoctor) {
      updateAvailableDates();
    }
  }, [selectedDoctor]);

  const updateAvailableDates = () => {
    if (!selectedDoctor) return;

    const today = new Date();
    const thisWeek: string[] = [];
    const nextWeek: string[] = [];

    for (let i = 0; i < 14; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Normalize day names to lowercase for consistent comparison
      const dayName = currentDate
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toLowerCase();

      // Ensure the backend day name is also normalized
      const availableDay = selectedDoctor.availability.find(
        (day) => day.day.toLowerCase() === dayName
      );

      if (availableDay) {
        const dateString = currentDate.toISOString().split("T")[0];
        if (i < 7) {
          thisWeek.push(dateString);
        } else {
          nextWeek.push(dateString);
        }
      }
    }

    setAvailableDates({ thisWeek, nextWeek });
  };

  const handleDateChange = (date: string) => {
    form.setFieldValue("date", date);
    form.setFieldValue("time", "");

    if (!selectedDoctor) return;

    // Get the selected day of the week in lowercase
    const selectedDay = new Date(date)
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    // Find the available day by comparing lowercase day names
    const availableDay = selectedDoctor.availability.find(
      (day) => day.day.toLowerCase() === selectedDay
    );

    console.log("Selected Date:", date);
    console.log("Selected Day:", selectedDay);
    console.log("Available Day:", availableDay);

    if (availableDay) {
      const timeSlots = availableDay.hours.map((hour) => ({
        value: hour,
        label: hour,
      }));
      console.log("Time Slots:", timeSlots);
      setAvailableTimes(timeSlots);
    } else {
      setAvailableTimes([]);
    }
  };

  const handleDoctorChange = (doctorId: string) => {
    const newSelectedDoctor = doctors?.find((d) => d.id === doctorId);
    setSelectedDoctor(newSelectedDoctor);
    form.setFieldValue("doctorId", doctorId);
    form.setFieldValue("date", "");
    form.setFieldValue("time", "");
  };

  const handleSubmit = (values: FormValues) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorId: values.doctorId,
      patientName: values.patientName,
      patientAge: values.patientAge,
      description: values.description,
      date: values.date,
      time: values.time,
      cancelled: false,
    };
    dispatch(addAppointment(newAppointment));
    form.reset();
    setAvailableTimes([]);
    onClose();
  };

  const renderDateBadges = (dates: string[]) => (
    <Group mt="xs">
      {dates.map((date) => (
        <Badge
          key={date}
          variant={form.values.date === date ? "filled" : "light"}
          onClick={() => handleDateChange(date)}
          style={{ cursor: "pointer" }}
        >
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Badge>
      ))}
    </Group>
  );

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={`Book an Appointment${
        selectedDoctor ? ` with Dr. ${selectedDoctor.name}` : ""
      }`}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {parentComponent === "AppointmentManagementSystem" && doctors && (
            <Select
              label="Select Doctor"
              placeholder="Choose a doctor"
              data={doctors.map((d) => ({ value: d.id, label: d.name }))}
              {...form.getInputProps("doctorId")}
              onChange={handleDoctorChange}
              required
            />
          )}
          <TextInput
            label="Patient Name"
            placeholder="Enter your full name"
            {...form.getInputProps("patientName")}
            required
          />
          <NumberInput
            label="Patient Age"
            placeholder="Enter your age"
            min={1}
            max={120}
            {...form.getInputProps("patientAge")}
            required
          />
          <Textarea
            label="Appointment Description"
            placeholder="Briefly describe the reason for your appointment"
            {...form.getInputProps("description")}
            required
          />
          {selectedDoctor && (
            <>
              <Tabs defaultValue="thisWeek">
                <Tabs.List>
                  <Tabs.Tab value="thisWeek">This Week</Tabs.Tab>
                  <Tabs.Tab value="nextWeek">Next Week</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="thisWeek">
                  {renderDateBadges(availableDates.thisWeek)}
                </Tabs.Panel>

                <Tabs.Panel value="nextWeek">
                  {renderDateBadges(availableDates.nextWeek)}
                </Tabs.Panel>
              </Tabs>
              <Select
                label="Select Appointment Time"
                placeholder="Choose a time slot"
                data={availableTimes}
                leftSection={<Clock size={14} />}
                {...form.getInputProps("time")}
                disabled={!form.values.date}
                required
              />
            </>
          )}
          <Button type="submit" fullWidth mt="md">
            Book Appointment
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default AppointmentForm;
