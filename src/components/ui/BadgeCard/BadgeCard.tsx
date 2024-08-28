import { motion } from "framer-motion";
import { IconHeart } from "@tabler/icons-react";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  Box,
} from "@mantine/core";
import { toggleFavorite } from "../../../redux/slices/FavoriteSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import classes from "./BadgeCard.module.css";
import { Doctor } from "../../../redux/slices/DoctorSlice";
import { Link } from "react-router-dom";

interface BadgeCardProps {
  doctor: Doctor;
}

export function BadgeCard({ doctor }: BadgeCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const isFavorite = favorites.includes(doctor.id);

  const handleFavorite = () => {
    dispatch(toggleFavorite(doctor.id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section>
          <Image
            src={doctor.image}
            alt={doctor.name}
            height={250}
            style={{ objectFit: "cover" }}
          />
        </Card.Section>
        <Box className={classes.contentWrapper}>
          <Card.Section className={classes.section} mt="md">
            <Group justify="apart">
              <Text fz="xl" fw={700}>
                Dr. {doctor.name}
              </Text>
              <Badge size="lg" color="blue" variant="light">
                {doctor.specialty}
              </Badge>
            </Group>
            <Text
              fz="sm"
              mt="xs"
              color="dimmed"
              className={classes.description}
            >
              {doctor.description}
            </Text>
          </Card.Section>
          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} c="dimmed">
              Specializations
            </Text>
            <Group gap={7} mt={5}>
              {doctor.badges.map((badge) => (
                <motion.div
                  key={badge.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    leftSection={badge.icon}
                    variant="outline"
                    color="blue"
                  >
                    {badge.label}
                  </Badge>
                </motion.div>
              ))}
            </Group>
          </Card.Section>
        </Box>
        <Group mt="xs" className={classes.footer}>
          <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }}>
            <Button radius="md" fullWidth color="blue">
              <Link to={`/doctor/${doctor.id}`}>Book Appointment</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ActionIcon
              variant="outline"
              radius="md"
              size={36}
              onClick={handleFavorite}
              color={isFavorite ? "red" : "gray"}
            >
              <IconHeart
                className={classes.like}
                stroke={1.5}
                fill={isFavorite ? "red" : "none"}
              />
            </ActionIcon>
          </motion.div>
        </Group>
      </Card>
    </motion.div>
  );
}
