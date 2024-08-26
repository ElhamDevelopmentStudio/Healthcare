import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Title,
  Text,
  Grid,
  TextInput,
  Select,
  Group,
  Paper,
  Accordion,
  RangeSlider,
  Checkbox,
  Pagination,
} from "@mantine/core";
import { Search, Filter } from "lucide-react";
import { BadgeCard } from "../components/ui/BadgeCard/BadgeCard";
import {
  fetchDoctors,
  selectAllDoctors,
  Doctor,
} from "../redux/slices/DoctorSlice";
import { useAppDispatch } from "../redux/store";

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

export function DoctorListPage() {
  const dispatch = useAppDispatch();
  const doctors = useSelector(selectAllDoctors);

  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const filteredDoctors = doctors.filter((doctor: Doctor) => {
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!specialty || doctor.specialty === specialty) &&
      (availability.length === 0 ||
        availability.some((day) => doctor.availability.includes(day))) &&
      doctor.price >= priceRange[0] &&
      doctor.price <= priceRange[1]
    );
  });

  const pageSize = 8;
  const pageCount = Math.ceil(filteredDoctors.length / pageSize);
  const displayedDoctors = filteredDoctors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Container size="xl" py="xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Title order={1} ta="center" mb="xl">
          Find Your Ideal Doctor
        </Title>
        <Text ta="center" size="lg" mb="xl" c="dimmed">
          Discover the perfect healthcare professional tailored to your needs.
        </Text>

        <Paper shadow="md" p="md" mb="xl">
          <Group grow mb="md">
            <TextInput
              leftSection={<Search size={16} />}
              placeholder="Search doctors by name"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              size="md"
            />
            <Select
              data={[
                "All Specialties",
                "Cardiology",
                "Neurology",
                "Pediatrics",
                "Oncology",
              ]}
              placeholder="Select specialty"
              value={specialty}
              onChange={setSpecialty}
              leftSection={<Filter size={16} />}
              size="md"
              clearable
            />
          </Group>

          <Accordion>
            <Accordion.Item value="advanced-filters">
              <Accordion.Control>Advanced Filters</Accordion.Control>
              <Accordion.Panel>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text
                      size="sm"
                      fw={500}
                      mb="xs"
                      className="flex items-center justify-center"
                    >
                      Availability
                    </Text>
                    <Checkbox.Group
                      value={availability}
                      onChange={setAvailability}
                    >
                      <Group>
                        <Checkbox value="monday" label="Mon" />
                        <Checkbox value="tuesday" label="Tue" />
                        <Checkbox value="wednesday" label="Wed" />
                        <Checkbox value="thursday" label="Thu" />
                        <Checkbox value="friday" label="Fri" />
                      </Group>
                    </Checkbox.Group>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text size="sm" fw={500} mb="xs">
                      Price Range
                    </Text>
                    <RangeSlider
                      className="mb-5"
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange}
                      onChange={setPriceRange}
                      marks={[
                        { value: 0, label: "$0" },
                        { value: 250, label: "$250" },
                        { value: 500, label: "$500" },
                      ]}
                    />
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Paper>

        <Grid gutter="xl">
          <AnimatePresence>
            {displayedDoctors.map((doctor: Doctor) => (
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

        {pageCount > 1 && (
          <Group justify="center" mt="xl">
            <Pagination
              total={pageCount}
              value={currentPage}
              onChange={setCurrentPage}
              size="lg"
              radius="md"
              withEdges
            />
          </Group>
        )}
      </motion.div>
    </Container>
  );
}
