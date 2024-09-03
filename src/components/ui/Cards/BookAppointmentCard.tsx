import React from "react";
import {
  Card,
  Title,
  Stack,
  Group,
  Text,
  Button,
  Badge,
  Tooltip,
} from "@mantine/core";
import { Calendar, Clock } from "lucide-react";
import { Doctor } from "../../../redux/slices/DoctorSlice";

interface BookAppointmentProps {
  doctor: Doctor;
  onSchedule: () => void;
}

export const BookAppointment: React.FC<BookAppointmentProps> = ({
  doctor,
  onSchedule,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">
        Book an Appointment
      </Title>
      <Stack>
        <Group gap="xs">
          <Calendar size={18} />
          <Text>Available days:</Text>
        </Group>
        <Group gap="xs">
          {doctor.availability.map((availability) => (
            <Tooltip
              key={availability.day}
              label={availability.hours.join(", ")}
              position="bottom"
              withArrow
            >
              <Badge variant="light" color="blue">
                {availability.day.charAt(0).toUpperCase() +
                  availability.day.slice(1)}
              </Badge>
            </Tooltip>
          ))}
        </Group>
        <Group gap="xs">
          <Clock size={18} />
          <Text>Response time: Within 1 hour</Text>
        </Group>
      </Stack>
      <Button fullWidth mt="xl" onClick={onSchedule}>
        Schedule Now
      </Button>
    </Card>
  );
};
