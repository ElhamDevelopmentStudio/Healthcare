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
  Tooltip,
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
      <Card
        withBorder
        radius="md"
        p="md"
        className={classes.card}
        style={{ height: "600px", display: "flex", flexDirection: "column" }}
      >
        <Card.Section style={{ height: "250px", overflow: "hidden" }}>
          <Image
            src={doctor.image}
            alt={doctor.name}
            height={250}
            fallbackSrc="/placeholder-image.jpg"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </Card.Section>
        <Box
          className={classes.contentWrapper}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <Card.Section className={classes.section} mt="md">
            <Group justify="apart">
              <Text
                fz="xl"
                fw={700}
                style={{ fontFamily: "New Amsterdam", letterSpacing: 3 }}
              >
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
              style={{
                height: "3em",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {doctor.description}
            </Text>
          </Card.Section>
          <Card.Section
            className={classes.section}
            style={{ flex: 1, overflowY: "auto" }}
          >
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
          <Card.Section className={classes.section} mt="md">
            <Text mt="md" className={classes.label} c="dimmed">
              Availability
            </Text>
            <Group gap={7} mt={5}>
              {doctor.availability.map((slot) => (
                <Tooltip
                  key={slot.day}
                  label={slot.hours.join(", ")}
                  withArrow
                  arrowSize={6}
                  transitionProps={{ transition: "fade", duration: 200 }}
                  position="top"
                >
                  <Badge variant="filled" color="green">
                    {slot.day}
                  </Badge>
                </Tooltip>
              ))}
            </Group>
          </Card.Section>
        </Box>
        <Group mt="xs" className={classes.footer}>
          <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }}>
            <Link to={`/doctor/${doctor.id}`}>
              <Button radius="md" fullWidth color="blue">
                Book Appointment
              </Button>
            </Link>
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