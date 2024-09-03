import React, { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { useAppDispatch } from "../../redux/store";
import {
  rescheduleAppointment,
  Appointment,
} from "../../redux/slices/AppointmentSlice";
import { Doctor } from "../../redux/slices/DoctorSlice";
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

interface RescheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  doctor: Doctor;
}

interface FormValues {
  patientName: string;
  patientAge: number;
  description: string;
  date: string;
  time: string;
}

const RescheduleForm: React.FC<RescheduleFormProps> = ({
  isOpen,
  onClose,
  appointment,
  doctor,
}) => {
  const dispatch = useAppDispatch();
  const [availableDates, setAvailableDates] = useState<{
    [key: string]: string[];
  }>({
    thisWeek: [],
    nextWeek: [],
  });
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const form = useForm<FormValues>({
    initialValues: {
      patientName: appointment.patientName,
      patientAge: appointment.patientAge,
      description: appointment.description,
      date: appointment.date,
      time: appointment.time,
    },
    validate: {
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
    updateAvailableDates();
  }, [doctor]);

  const updateAvailableDates = () => {
    const today = new Date();
    const thisWeek: string[] = [];
    const nextWeek: string[] = [];

    for (let i = 0; i < 14; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dayName = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const availableDay = doctor.availability.find(
        (day) => day.day.toLowerCase() === dayName.toLowerCase()
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

    const selectedDay = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const availableDay = doctor.availability.find(
      (day) => day.day.toLowerCase() === selectedDay.toLowerCase()
    );

    if (availableDay) {
      const timeSlots = availableDay.hours.map((hour) => ({
        value: hour,
        label: hour,
      }));
      // @ts-expect-error ignore
      setAvailableTimes(timeSlots);
    } else {
      setAvailableTimes([]);
    }
  };

  const handleSubmit = (values: FormValues) => {
    dispatch(
      rescheduleAppointment({
        id: appointment.id,
        date: values.date,
        time: values.time,
        patientAge: values.patientAge,
      })
    );
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
      title={`Reschedule Appointment with Dr. ${doctor.name}`}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Patient Name"
            placeholder="Enter your full name"
            {...form.getInputProps("patientName")}
            required
            disabled
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
          <Button type="submit" fullWidth mt="md">
            Reschedule Appointment
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default RescheduleForm;
