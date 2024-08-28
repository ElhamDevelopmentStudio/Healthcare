import { Card, Image, Text, Badge, Group, Button } from "@mantine/core";
import { selectSelectedDoctor } from "../../redux/slices/DoctorSlice";
import { toggleFavorite } from "../../redux/slices/FavoriteSlice";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export const DoctorDetail = () => {
  const doctor = useSelector(selectSelectedDoctor);
  const dispatch = useDispatch();

  if (!doctor) return null;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={doctor.image} height={160} alt={doctor.name} />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Text fw={500}>{doctor.name}</Text>
        <Badge color="pink" variant="light">
          {doctor.specialty}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {doctor.description}
      </Text>

      <Text mt="md" fw={500}>
        Qualifications:
      </Text>
      <ul>
        {doctor.qualifications?.map((qual, index) => (
          <li key={index}>{qual}</li>
        ))}
      </ul>

      <Text mt="md" fw={500}>
        Bio:
      </Text>
      <Text size="sm">{doctor.bio}</Text>

      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => dispatch(toggleFavorite(doctor.id))}
      >
        <Heart size={16} /> Add to Favorites
      </Button>
    </Card>
  );
};
