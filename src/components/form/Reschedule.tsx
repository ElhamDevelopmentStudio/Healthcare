import React from "react";
import { Modal, Stack, Select, TextInput, Button } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { showNotification } from "@mantine/notifications";
import {
  Appointment,
  rescheduleAppointment,
} from "../../redux/slices/AppointmentSlice";
import { Doctor } from "../../redux/slices/DoctorSlice";

interface RescheduleModalProps {
  opened: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  doctors: Doctor[];
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  opened,
  onClose,
  appointment,
  doctors,
}) => {
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      doctorId: appointment?.doctorId || "",
      patientName: appointment?.patientName || "",
      patientAge: appointment?.patientAge.toString() || "",
      description: appointment?.description || "",
      date: appointment ? new Date(appointment.date) : null,
      time: appointment?.time || "",
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
    if (appointment) {
      const updatedAppointment = {
        id: appointment.id,
        doctorId: values.doctorId || appointment.doctorId,
        patientName: values.patientName || appointment.patientName,
        patientAge: values.patientAge
          ? parseInt(values.patientAge, 10)
          : appointment.patientAge,
        description: values.description || appointment.description,
        date: values.date ? values.date.toISOString() : appointment.date,
        time: values.time || appointment.time,
      };

      dispatch(rescheduleAppointment(updatedAppointment));
      onClose();
      showNotification({
        title: "Appointment Rescheduled",
        message: "Your appointment has been successfully rescheduled.",
        color: "blue",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Reschedule Appointment"
      size="lg"
    >
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
            Save Changes
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default RescheduleModal;
