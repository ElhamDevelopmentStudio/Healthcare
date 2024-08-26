import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Title,
  Text,
  Grid,
  Paper,
  Button,
  Group,
  Center,
  Loader,
  Pagination,
} from "@mantine/core";
import { Heart } from "lucide-react";
import { BadgeCard } from "../components/ui/BadgeCard/BadgeCard";
import { selectFavorites } from "../redux/slices/FavoriteSlice";
import {
  selectAllDoctors,
  Doctor,
  fetchDoctors,
} from "../redux/slices/DoctorSlice";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export function FavoriteDoctorsPage() {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const allDoctors = useSelector((state: RootState) => selectAllDoctors(state));
  const status = useSelector((state: RootState) => state.doctors.status);
  const [favoriteDoctors, setFavoriteDoctors] = useState<Doctor[]>([]);
  const [activePage, setActivePage] = useState(1);
  const doctorsPerPage = 8; // Number of doctors per page

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors() as unknown as Promise<void>);
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      const filteredDoctors = allDoctors.filter((doctor) =>
        favorites.includes(doctor.id)
      );
      setFavoriteDoctors(filteredDoctors);
    }
  }, [favorites, allDoctors, status]);

  if (status === "loading") {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (status === "failed") {
    return (
      <Center style={{ height: "100vh" }}>
        <Text>Error loading doctors. Please try again later.</Text>
      </Center>
    );
  }

  const startIndex = (activePage - 1) * doctorsPerPage;
  const paginatedDoctors = favoriteDoctors.slice(
    startIndex,
    startIndex + doctorsPerPage
  );

  return (
    <Container size="xl" py="xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Title order={1} ta="center" mb="xl">
          Your Favorite Doctors
        </Title>
        <Text ta="left" size="lg" mb="xl" className="mt-16" c="dimmed">
          Quick access to your preferred healthcare professionals
        </Text>

        {paginatedDoctors.length > 0 ? (
          <Grid gutter="xl">
            <AnimatePresence>
              {paginatedDoctors.map((doctor) => (
                <Grid.Col
                  key={doctor.id}
                  span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                >
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <BadgeCard doctor={doctor} />
                  </motion.div>
                </Grid.Col>
              ))}
            </AnimatePresence>
          </Grid>
        ) : (
          <Paper shadow="md" p="xl" withBorder>
            <Center style={{ flexDirection: "column" }}>
              <Heart size={48} color="#868e96" />
              <Text size="xl" className="text-3xl" mt="md" ta="center">
                No favorite doctors yet
              </Text>
              <Text size="sm" color="dimmed" mt="xs" ta="center">
                Start adding doctors to your favorites list to see them here
              </Text>
              <Button
                component={Link}
                to="/"
                variant="light"
                color="blue"
                mt="lg"
              >
                Browse Doctors
              </Button>
            </Center>
          </Paper>
        )}
        <Center mt="xl">
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={Math.ceil(favoriteDoctors.length / doctorsPerPage)}
          />
        </Center>

        <Group align="center" mt="xl">
          <Button component={Link} to="/" variant="outline">
            Back to All Doctors
          </Button>
        </Group>
      </motion.div>
    </Container>
  );
}
