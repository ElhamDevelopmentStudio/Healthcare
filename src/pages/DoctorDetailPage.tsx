import React from "react";
import { useParams } from "react-router-dom";
import { Container, Grid } from "@mantine/core";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorDisplay } from "../components/ui/DoctorDetailError";
import { DoctorProfile } from "../components/ui/DoctorProfile";
import { useDoctorDetails } from "../hooks/useDoctorDetails";
import { AppointmentBooking } from "../components/form/AppointmentBooking";

export const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { doctor, status, error } = useDoctorDetails(id);

  if (status === "loading") return <LoadingSpinner />;
  if (status === "failed") return <ErrorDisplay message={error!} />;
  if (!doctor) return <ErrorDisplay message="Doctor not found" />;

  return (
    <Container size="xl" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
          <DoctorProfile doctor={doctor} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
          <AppointmentBooking doctorId={doctor.id} doctorName={doctor.name} />
        </Grid.Col>
      </Grid>
    </Container>
  );
};
