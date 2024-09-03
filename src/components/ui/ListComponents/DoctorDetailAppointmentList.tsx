import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Title,
  Text,
  Accordion,
  Group,
  Badge,
  Stack,
  Button,
} from "@mantine/core";
import { Edit, X, Trash } from "lucide-react";
import {
  selectAppointments,
  cancelAppointment,
  removeAppointment,
  Appointment,
} from "../../../redux/slices/AppointmentSlice";
import { showNotification } from "@mantine/notifications";

interface DoctorDetailAppointmentListProps {
  doctorId: string;
  onEdit: (appointment: Appointment) => void;
  onEditClick: () => void;
}

export const DoctorDetailAppointmentList: React.FC<
  DoctorDetailAppointmentListProps
> = ({ doctorId, onEdit, onEditClick }) => {
  const dispatch = useDispatch();
  const appointments = useSelector(selectAppointments);

  const doctorAppointments = appointments.filter(
    (app) => app.doctorId === doctorId
  );

  const handleCancelAppointment = (appointmentId: string) => {
    dispatch(cancelAppointment(appointmentId));
    showNotification({
      title: "Appointment Cancelled",
      message: "Your appointment has been cancelled.",
      color: "orange",
    });
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    dispatch(removeAppointment(appointmentId));
    showNotification({
      title: "Appointment Deleted",
      message: "Your appointment has been permanently deleted.",
      color: "red",
    });
  };

  return (
    <Card ta="left" shadow="sm" padding="lg" radius="md" withBorder mt="xl">
      <Title order={3} mb="md">
        Your Appointments
      </Title>
      {doctorAppointments.length === 0 ? (
        <Text color="dimmed">You have no appointments with this doctor.</Text>
      ) : (
        <>
          <Accordion>
            {doctorAppointments.map((appointment) => (
              <Accordion.Item key={appointment.id} value={appointment.id}>
                <Accordion.Control>
                  <Group>
                    <Text>
                      {new Date(appointment.date).toLocaleDateString()}
                    </Text>
                    <Text>{appointment.time}</Text>
                    {appointment.cancelled && (
                      <Badge color="red" variant="light">
                        Cancelled
                      </Badge>
                    )}
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <Text>
                      <strong>Patient:</strong> {appointment.patientName}
                    </Text>
                    <Text>
                      <strong>Age:</strong> {appointment.patientAge}
                    </Text>
                    <Text>
                      <strong>Reason:</strong> {appointment.description}
                    </Text>
                    <Group align="right">
                      <Button
                        variant="outline"
                        color="blue"
                        leftSection={<Edit size={14} />}
                        onClick={() => {
                          onEdit(appointment);
                          onEditClick();
                        }}
                        disabled={appointment.cancelled}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        color="red"
                        leftSection={<X size={14} />}
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={appointment.cancelled}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="filled"
                        color="red"
                        leftSection={<Trash size={14} />}
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      )}
    </Card>
  );
};
