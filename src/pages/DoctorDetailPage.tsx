import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid } from "@mantine/core";
import { useDoctorDetails } from "../hooks/useDoctorDetails";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorDisplay } from "../components/ui/DoctorDetailError";
import { Appointment } from "../redux/slices/AppointmentSlice";
import { DoctorCard } from "../components/ui/Cards/DoctorCard";
import { BookAppointment } from "../components/ui/Cards/BookAppointmentCard";
import { DoctorDetailAppointmentList } from "../components/ui/ListComponents/DoctorDetailAppointmentList";
import AppointmentForm from "../components/ui/Modals/AppointmentModal";
import RescheduleForm from "../components/form/RescheduleForm";

export const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { doctor, status, error } = useDoctorDetails(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  if (status === "loading") return <LoadingSpinner />;
  if (status === "failed")
    return <ErrorDisplay message={error ?? "Unknown error occurred"} />;
  if (!doctor) return <ErrorDisplay message="Doctor not found" />;

  return (
    <Container size="xl" py="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <DoctorCard doctor={doctor} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <BookAppointment
            doctor={doctor}
            onSchedule={() => {
              setEditingAppointment(null);
              setIsModalOpen(true);
            }}
          />
          <DoctorDetailAppointmentList
            doctorId={id ?? ""}
            onEdit={setEditingAppointment}
            onEditClick={() => setIsEditingModalOpen(true)}
          />
        </Grid.Col>
      </Grid>
      <AppointmentForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentComponent="DoctorDetailPage"
        doctor={doctor}
      />
      {editingAppointment && (
        <RescheduleForm
          isOpen={isEditingModalOpen}
          onClose={() => setIsEditingModalOpen(false)}
          appointment={editingAppointment!}
          doctor={doctor}
        />
      )}
    </Container>
  );
};
