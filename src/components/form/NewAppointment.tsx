import React from "react";
import { Modal, Stack, Select, TextInput, Button } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { Doctor } from "../../redux/slices/DoctorSlice";
import { addAppointment } from "../../redux/slices/AppointmentSlice";

interface NewAppointmentModalProps {
  opened: boolean;
  onClose: () => void;
  doctors: Doctor[];
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  opened,
  onClose,
  doctors,
}) => {
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      doctorId: "",
      patientName: "",
      patientAge: "",
      description: "",
      date: null as Date | null,
      time: "",
    },
    validate: {
      doctorId: (value) => (value ? null : "Doctor is required"),
      patientName: (value) => (value ? null : "Patient name is required"),
      patientAge: (value) =>
        /^\d+$/.test(value) ? null : "Age must be a number",
      date: (value) => (value ? null : "Date is required"),
      time: (value) => (value ? null : "Time is required"),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    dispatch(
      addAppointment({
        id: Math.random().toString(36).substr(2, 9),
        ...values,
        date: values.date!.toISOString(),
        patientAge: parseInt(values.patientAge, 10),
        cancelled: false,
      })
    );
    onClose();
    showNotification({
      title: "Appointment Added",
      message: "Your new appointment has been successfully added.",
      color: "green",
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="New Appointment" size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Doctor"
            placeholder="Select doctor"
            data={doctors.map((doctor) => ({
              value: doctor.id,
              label: `Dr. ${doctor.name}`,
            }))}
            {...form.getInputProps("doctorId")}
          />
          <TextInput
            label="Patient Name"
            placeholder="Enter patient name"
            {...form.getInputProps("patientName")}
          />
          <TextInput
            label="Patient Age"
            placeholder="Enter patient age"
            {...form.getInputProps("patientAge")}
          />
          <DatePickerInput
            label="Date"
            placeholder="Select date"
            minDate={new Date()}
            {...form.getInputProps("date")}
          />
          <TimeInput
            label="Time"
            placeholder="Select time"
            {...form.getInputProps("time")}
          />
          <TextInput
            label="Description"
            placeholder="Enter appointment description"
            {...form.getInputProps("description")}
          />
          <Button type="submit" fullWidth>
            Add Appointment
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default NewAppointmentModal;
