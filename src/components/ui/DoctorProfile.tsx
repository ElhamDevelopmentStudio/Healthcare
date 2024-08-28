import React from "react";
import { Card, Image, Text, Badge, Group, Stack, Title } from "@mantine/core";
import { DollarSign, Star } from "lucide-react";

interface DoctorProfileProps {
  doctor: {
    name: string;
    image: string;
    specialty: string;
    description: string;
    badges: Array<{ icon: React.ReactNode; label: string }>;
    price: number;
    bio?: string;
    qualifications?: string[];
  };
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={doctor.image} height={200} alt={doctor.name} />
      </Card.Section>

      <Group mt="md" mb="xs">
        <Title order={2}>Dr. {doctor.name}</Title>
        <Badge color="blue" variant="light">
          {doctor.specialty}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {doctor.description}
      </Text>

      <Group mt="md" mb="xs">
        {doctor.badges.map((badge, index) => (
          <Badge key={index} leftSection={badge.icon}>
            {badge.label}
          </Badge>
        ))}
      </Group>

      <Group mt="md" mb="xs">
        <DollarSign size={14} />
        <Text>${doctor.price} per consultation</Text>
        <Star size={14} />
      </Group>

      {doctor.bio && (
        <Text mt="md">
          <strong>Bio:</strong> {doctor.bio}
        </Text>
      )}

      {doctor.qualifications && (
        <Stack mt="md">
          <Text fw={700}>Qualifications:</Text>
          <ul>
            {doctor.qualifications.map((qual, index) => (
              <li key={index}>{qual}</li>
            ))}
          </ul>
        </Stack>
      )}
    </Card>
  );
};
