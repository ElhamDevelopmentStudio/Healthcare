import React, { useState } from "react";
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
import ConfirmationDialog from "../Modals/DeleteDialog";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );

  const openDeleteConfirmation = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      dispatch(removeAppointment(appointmentToDelete));
      showNotification({
        title: "Appointment Deleted",
        message: "Your appointment has been permanently deleted.",
        color: "red",
      });
    }
    setDialogOpen(false); // Close dialog
  };

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

  return (
    <>
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
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                          disabled={appointment.cancelled}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="filled"
                          color="red"
                          leftSection={<Trash size={14} />}
                          onClick={() => openDeleteConfirmation(appointment.id)}
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
      <ConfirmationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onDelete={handleConfirmDelete}
        titleText="Delete Appointment"
        descriptionText="Are you sure you want to permanently delete this appointment? This action cannot be undone."
      />
    </>
  );
};
