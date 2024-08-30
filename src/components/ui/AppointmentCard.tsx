import React from "react";
import {
  Card,
  Text,
  Group,
  Stack,
  ThemeIcon,
  Badge,
  Button,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { endOfToday, format, isBefore } from "date-fns";
import { Appointment } from "../../redux/slices/AppointmentSlice";
import { useSelector } from "react-redux";
import { selectAllDoctors } from "../../redux/slices/DoctorSlice";

interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onReschedule,
  onCancel,
  onRemove,
}) => {
  const doctors = useSelector(selectAllDoctors);
  const doctor = doctors.find((doc) => doc.id === appointment.doctorId);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const isFutureAppointment = isBefore(new Date(), endOfToday());

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section
          inheritPadding
          py="xs"
          style={{
            backgroundColor: appointment.cancelled ? "#ffcccb" : "#f0f0f0",
          }}
        >
          <Group align="apart">
            <Text fw={500} size="lg">
              Dr. {doctor ? doctor.name : "Unknown"}
            </Text>
            <Group gap={5}>
              {appointment.cancelled && (
                <Badge color="red" variant="filled">
                  Cancelled
                </Badge>
              )}
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon>
                    <ChevronDown size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown className="flex flex-col">
                  {isFutureAppointment && !appointment.cancelled && (
                    <Menu.Item onClick={() => onReschedule(appointment)}>
                      <Edit2 size={14} /> Reschedule
                    </Menu.Item>
                  )}
                  {isFutureAppointment && !appointment.cancelled && (
                    <Menu.Item
                      color="red"
                      onClick={() => onCancel(appointment.id)}
                    >
                      <Trash2 size={14} /> Cancel
                    </Menu.Item>
                  )}
                  {(appointment.cancelled || !isFutureAppointment) && (
                    <Menu.Item
                      color="red"
                      onClick={() => onRemove(appointment.id)}
                    >
                      <Trash2 size={14} /> Remove
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Card.Section>

        <Stack gap="sm" mt="md">
          <Group gap="xs">
            <ThemeIcon color="blue" size="sm" radius="xl">
              <User size={14} />
            </ThemeIcon>
            <Text size="sm">
              {appointment.patientName}, {appointment.patientAge} years
            </Text>
          </Group>
          <Group gap="xs">
            <ThemeIcon color="grape" size="sm" radius="xl">
              <Calendar size={14} />
            </ThemeIcon>
            <Text size="sm">
              {format(new Date(appointment.date), "MMMM d, yyyy")}
            </Text>
          </Group>
          <Group gap="xs">
            <ThemeIcon color="teal" size="sm" radius="xl">
              <Clock size={14} />
            </ThemeIcon>
            <Text size="sm">{appointment.time}</Text>
          </Group>
          <Text size="sm" color="dimmed">
            {appointment.description}
          </Text>
        </Stack>

        {!appointment.cancelled && isFutureAppointment && (
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => onReschedule(appointment)}
          >
            <Edit2 size={14} /> Reschedule
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default AppointmentCard;
