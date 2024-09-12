import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { AppDispatch, RootState } from "../redux/store";
import { Sidebar } from "../components/ui/Filters/DoctorListFiltersSidebar";
import { ErrorDisplay } from "../components/ui/DoctorDetailError";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

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
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector(selectFavorites);
  const allDoctors = useSelector((state: RootState) => selectAllDoctors(state));
  const status = useSelector((state: RootState) => state.doctors.status);

  const [favoriteDoctors, setFavoriteDoctors] = useState<Doctor[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const doctorsPerPage = 8;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
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

  const filteredDoctors = favoriteDoctors.filter((doctor) => {
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!specialty || doctor.specialty === specialty) &&
      (availability.length === 0 ||
        availability.some((day) =>
          doctor.availability.map((slot) => slot.day).includes(day)
        )) &&
      doctor.price >= priceRange[0] &&
      doctor.price <= priceRange[1]
    );
  });

  const startIndex = (activePage - 1) * doctorsPerPage;
  const paginatedDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + doctorsPerPage
  );

  if (status === "loading") {
    return (
      <Center style={{ height: "100vh" }}>
        <LoadingSpinner />
      </Center>
    );
  }

  if (status === "failed") {
    return (
      <Center style={{ height: "100vh" }}>
        <ErrorDisplay message="Error loading doctors. Please try again later." />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl" className="relative">
      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        specialty={specialty}
        setSpecialty={setSpecialty}
        availability={availability}
        setAvailability={setAvailability}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <div
          className={`relative ${isSidebarOpen ? "md:blur-none blur-sm" : ""}`}
        >
          <Title order={1} ta="center" mb="xl">
            Your Favorite Doctors
          </Title>
          <Text ta="left" size="lg" mb="xl" className="mt-20" c="dimmed">
            Quick access to your preferred healthcare professionals
          </Text>

          {paginatedDoctors.length > 0 ? (
            <Grid gutter="xl">
              <AnimatePresence>
                {paginatedDoctors.map((doctor) => (
                  <Grid.Col
                    key={doctor.id}
                    span={{ base: 12, sm: 10, md: 6, lg: 4 }}
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
              total={Math.ceil(filteredDoctors.length / doctorsPerPage)}
            />
          </Center>

          <Group align="center" mt="xl">
            <Button component={Link} to="/" variant="outline">
              Back to All Doctors
            </Button>
          </Group>
        </div>
      </motion.div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </Container>
  );
}
