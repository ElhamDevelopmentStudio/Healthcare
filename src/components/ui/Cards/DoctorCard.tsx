import React from "react";
import {
  Card,
  Image,
  Group,
  Badge,
  Text,
  Tabs,
  Stack,
  Title,
} from "@mantine/core";
import {
  DollarSign,
  Star,
  FileText,
  Award,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";
import { Doctor } from "../../../redux/slices/DoctorSlice";

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
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
          <Tabs.Tab value="qualifications" leftSection={<Award size={14} />}>
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
                  <span className="text-muted-foreground italic">
                    No location available.
                  </span>
                )}
              </Text>
            </Group>
            <Group gap="xs">
              <Phone size={18} />
              <Text>
                {doctor.phoneNumber || (
                  <span className="text-muted-foreground italic">
                    No phone number available.
                  </span>
                )}
              </Text>
            </Group>
            <Group gap="xs">
              <Mail size={18} />
              <Text>
                {doctor.email || (
                  <span className="text-muted-foreground italic">
                    No email available.
                  </span>
                )}
              </Text>
            </Group>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};
