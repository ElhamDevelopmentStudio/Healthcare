import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  Text,
  Button,
  TextInput,
  Textarea,
  NumberInput,
  Stack,
} from "@mantine/core";
import { DatePickerInput, DatesProvider } from "@mantine/dates";
import { TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch } from "react-redux";
import { addAppointment } from "../../redux/slices/AppointmentSlice";
import { v4 as uuidv4 } from "uuid";
import "@mantine/dates/styles.css";

dayjs.extend(customParseFormat);

const appointmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().int().positive().max(120),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date(),
  time: z.string(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentBookingProps {
  doctorId: string;
  doctorName: string;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  doctorId,
  doctorName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      age: undefined,
      description: "",
      date: new Date(),
      time: "",
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);

    const appointment = {
      id: uuidv4(), 
      doctorId,
      patientName: data.name,
      patientAge: data.age,
      description: data.description,
      date: data.date.toISOString(),
      time: data.time,
      cancelled: false,
    };

    dispatch(addAppointment(appointment));

    console.log("Appointment booked:", { doctorId, ...data });
    setIsSubmitting(false);
  };

  return (
    <DatesProvider settings={{ consistentWeeks: true }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section p="md">
          <Text size="xl" fw={500}>
            Book an Appointment
          </Text>
          <Text size="sm" color="dimmed">
            with Dr. {doctorName}
          </Text>
        </Card.Section>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack p="md">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  label="Full Name"
                  placeholder="Your full name"
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Age"
                  placeholder="Your age"
                  error={errors.age?.message}
                  min={1}
                  max={120}
                  {...field}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Reason for Appointment"
                  placeholder="Briefly describe your reason for the appointment"
                  error={errors.description?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePickerInput
                  label="Date"
                  placeholder="Pick date"
                  value={field.value}
                  onChange={field.onChange}
                  minDate={new Date()}
                  error={errors.date?.message}
                />
              )}
            />
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TimeInput
                  label="Time"
                  placeholder="Select time"
                  error={errors.time?.message}
                  {...field}
                />
              )}
            />
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </Button>
          </Stack>
        </form>
      </Card>
    </DatesProvider>
  );
};
