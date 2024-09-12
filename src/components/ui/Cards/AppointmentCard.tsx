import React from "react";
import {
  Card,
  Text,
  Group,
  Stack,
  Avatar,
  Badge,
  Button,
  ActionIcon,
  Menu,
  ThemeIcon,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { format, isBefore } from "date-fns";
import { useSelector } from "react-redux";
import { Appointment } from "../../../redux/slices/AppointmentSlice";
import { selectAllDoctors } from "../../../redux/slices/DoctorSlice";

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

  const isFutureAppointment = isBefore(new Date(), new Date(appointment.date));

  const getStatusColor = (): string => {
    if (appointment.cancelled) return "red";
    if (isFutureAppointment) return "green";
    return "gray";
  };

  const getStatusText = (): string => {
    if (appointment.cancelled) return "Cancelled";
    if (isFutureAppointment) return "Upcoming";
    return "Past";
  };

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
        <Group align="apart" mb="xs">
          <Group>
            <Avatar
              src={doctor?.image}
              alt={doctor?.name}
              radius="xl"
              size="lg"
            >
              {doctor?.name?.charAt(0) || "D"}
            </Avatar>
            <div>
              <Text fw={500} size="lg">
                Dr. {doctor ? doctor.name : "Unknown"}
              </Text>

              {doctor?.qualifications?.map((quality) => {
                return (
                  <span className="mr-2 text-gray-600" key={quality}>
                    {quality},
                  </span>
                );
              })}
            </div>
          </Group>
          <Badge color={getStatusColor()} variant="light" size="lg">
            {getStatusText()}
          </Badge>
        </Group>

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
        </Stack>

        <Text size="sm" color="dimmed" mt="md">
          {appointment.description}
        </Text>

        <Group align="apart" mt="lg">
          {!appointment.cancelled && isFutureAppointment && (
            <Button
              variant="light"
              color="blue"
              onClick={() => onReschedule(appointment)}
              leftSection={<Edit2 size={14} />}
            >
              Reschedule
            </Button>
          )}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon className="mt-1">
                <MoreVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {isFutureAppointment && !appointment.cancelled && (
                <Menu.Item
                  leftSection={<Edit2 size={14} />}
                  onClick={() => onReschedule(appointment)}
                >
                  Reschedule
                </Menu.Item>
              )}
              {isFutureAppointment && !appointment.cancelled && (
                <Menu.Item
                  color="red"
                  leftSection={<Trash2 size={14} />}
                  onClick={() => onCancel(appointment.id)}
                >
                  Cancel
                </Menu.Item>
              )}
              {(appointment.cancelled || !isFutureAppointment) && (
                <Menu.Item
                  color="red"
                  leftSection={<Trash2 size={14} />}
                  onClick={() => onRemove(appointment.id)}
                >
                  Remove
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card>
    </motion.div>
  );
};

export default AppointmentCard;
