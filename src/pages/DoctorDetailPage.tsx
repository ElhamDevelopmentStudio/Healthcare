import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Card,
  Image,
  Text,
  Badge,
  Group,
  Stack,
  Title,
  Button,
  Modal,
  Tabs,
  Accordion,
  TextInput,
  Textarea,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  DollarSign,
  Star,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Award,
  Edit,
  Trash,
  X,
} from "lucide-react";
import { useDoctorDetails } from "../hooks/useDoctorDetails";
import {
  addAppointment,
  cancelAppointment,
  updateAppointment,
  removeAppointment,
  selectAppointments,
  Appointment,
} from "../redux/slices/AppointmentSlice";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorDisplay } from "../components/ui/DoctorDetailError";

interface AppointmentFormValues {
  doctorId: string;
  patientName: string;
  patientAge: string;
  description: string;
  date: Date | null;
  time: string;
}

export const DoctorDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { doctor, status, error } = useDoctorDetails(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const appointments = useSelector(selectAppointments);
  const doctorAppointments = appointments.filter((app) => app.doctorId === id);

  const form = useForm({
    initialValues: {
      doctorId: id,
      patientName: "",
      patientAge: "",
      description: "",
      date: null,
      time: "",
    },
    validate: {
      patientName: (value) => (value ? null : "Patient name is required"),
      patientAge: (value) =>
        /^\d+$/.test(value) ? null : "Age must be a number",
      date: (value: Date | null) => {
        if (!value) return "Date is required";
        const dayOfWeek = value
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase();
        if (!doctor?.availability.includes(dayOfWeek)) {
          return "Doctor is not available on this day";
        }
        return null;
      },
      time: (value) => (value ? null : "Time is required"),
    },
  });

  if (status === "loading") return <LoadingSpinner />;
  if (status === "failed")
    return <ErrorDisplay message={error ?? "Unknown error occurred"} />;
  if (!doctor) return <ErrorDisplay message="Doctor not found" />;

  const handleSubmit = (values: AppointmentFormValues) => {
    const appointmentData = {
      id: editingAppointment
        ? editingAppointment.id
        : Math.random().toString(36).substr(2, 9),
      ...values,
      date: values.date.toISOString(),
      patientAge: parseInt(values.patientAge, 10),
      cancelled: false,
    };

    if (editingAppointment) {
      dispatch(updateAppointment(appointmentData));
      showNotification({
        title: "Appointment Updated",
        message: "Your appointment has been successfully updated.",
        color: "blue",
      });
    } else {
      dispatch(addAppointment(appointmentData));
      showNotification({
        title: "Appointment Booked",
        message: "Your appointment has been successfully scheduled.",
        color: "green",
      });
    }

    setIsModalOpen(false);
    setEditingAppointment(null);
    form.reset();
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    form.setValues({
      ...appointment,
      date: new Date(appointment.date),
    });
    setIsModalOpen(true);
  };

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

  const availableDays = doctor.availability.map(
    (day) => day.charAt(0).toUpperCase() + day.slice(1)
  );

  return (
    <Container size="xl" py="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image src={doctor.image} height={300} alt={doctor.name} />
            </Card.Section>
            <Group align="apart" mt="md" mb="xs">
              <Title order={2}>Dr. {doctor.name}</Title>
              <Badge color="blue" variant="light" size="lg">
                {doctor.specialty}
              </Badge>
            </Group>
            <Text size="sm" color="dimmed" mb="md">
              {doctor.description}
            </Text>
            <Group gap="xs" mb="md">
              {doctor.badges.map((badge, index) => (
                <Badge key={index} leftSection={badge.icon} variant="outline">
                  {badge.label}
                </Badge>
              ))}
            </Group>
            <Group gap="lg" mb="md">
              <Group gap="xs">
                <DollarSign size={18} />
                <Text fw={500}>${doctor.price} per consultation</Text>
              </Group>
              <Group gap="xs">
                <Star size={18} />
                <Text fw={500}>4.8 (120 reviews)</Text>
              </Group>
            </Group>
            <Tabs defaultValue="about">
              <Tabs.List>
                <Tabs.Tab value="about" leftSection={<FileText size={14} />}>
                  About
                </Tabs.Tab>
                <Tabs.Tab
                  value="qualifications"
                  leftSection={<Award size={14} />}
                >
                  Qualifications
                </Tabs.Tab>
                <Tabs.Tab value="contact" leftSection={<Phone size={14} />}>
                  Contact
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="about" pt="xs">
                <Text>{doctor.bio}</Text>
              </Tabs.Panel>

              <Tabs.Panel value="qualifications" pt="xs">
                <Stack align="left">
                  {doctor.qualifications?.map((qual, index) => (
                    <Text key={index}>• {qual}</Text>
                  ))}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="contact" pt="xs">
                <Stack>
                  <Group gap="xs">
                    <MapPin size={18} />
                    <Text>
                      {doctor.location || (
                        <div className="text-muted-foreground italic">
                          No location available.
                        </div>
                      )}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Phone size={18} />
                    <Text>
                      {doctor.phoneNumber || (
                        <div className="text-muted-foreground italic">
                          No phone number available.
                        </div>
                      )}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Mail size={18} />
                    <Text>
                      {doctor.email || (
                        <div className="text-muted-foreground italic">
                          No email available.
                        </div>
                      )}
                    </Text>
                  </Group>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Book an Appointment
            </Title>
            <Stack>
              <Group gap="xs">
                <Calendar size={18} />
                <Text>Available days: {availableDays.join(", ")}</Text>
              </Group>
              <Group gap="xs">
                <Clock size={18} />
                <Text>Response time: Within 1 hour</Text>
              </Group>
            </Stack>
            <Button
              fullWidth
              mt="xl"
              onClick={() => {
                setEditingAppointment(null);
                form.reset();
                setIsModalOpen(true);
              }}
            >
              Schedule Now
            </Button>
          </Card>

          <Card
            ta="left"
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            mt="xl"
          >
            <Title order={3} mb="md">
              Your Appointments
            </Title>
            {doctorAppointments.length === 0 ? (
              <Text color="dimmed">
                You have no appointments with this doctor.
              </Text>
            ) : (
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
                            onClick={() => handleEditAppointment(appointment)}
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
                            onClick={() =>
                              handleDeleteAppointment(appointment.id)
                            }
                          >
                            Delete
                          </Button>
                        </Group>
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppointment(null);
          form.reset();
        }}
        title={editingAppointment ? "Edit Appointment" : "Book an Appointment"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Patient Name"
              placeholder="Enter your full name"
              required
              {...form.getInputProps("patientName")}
            />
            <TextInput
              label="Patient Age"
              placeholder="Enter your age"
              required
              {...form.getInputProps("patientAge")}
            />
            <DatePickerInput
              label="Appointment Date"
              placeholder="Select date"
              required
              minDate={new Date()}
              excludeDate={(date) => {
                const dayOfWeek = date
                  .toLocaleDateString("en-US", { weekday: "long" })
                  .toLowerCase();
                return !doctor.availability.includes(dayOfWeek);
              }}
              {...form.getInputProps("date")}
            />
            <TimeInput
              label="Appointment Time"
              placeholder="Select time"
              required
              {...form.getInputProps("time")}
            />
            <Textarea
              label="Reason for Visit"
              placeholder="Briefly describe your reason for the appointment"
              {...form.getInputProps("description")}
            />
            <Button type="submit" fullWidth mt="md">
              {editingAppointment ? "Update Appointment" : "Confirm Booking"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};
