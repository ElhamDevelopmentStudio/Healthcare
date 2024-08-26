import { useState, useEffect } from "react";
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
import { Search, Filter, Activity, Baby, Brain, Heart } from "lucide-react";
import { BadgeCard } from "../components/ui/BadgeCard/BadgeCard";
import { fetchDoctors, Doctor } from "../redux/slices/DoctorSlice";
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

const mockDoctors: Doctor[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    description:
      "Experienced cardiologist with over 15 years of practice. Specializes in preventive cardiology and heart disease management.",
    badges: [
      { icon: <Heart size={14} />, label: "Heart Disease" },
      { icon: <Activity size={14} />, label: "Tension" },
    ],
    availability: ["monday", "wednesday", "friday"],
    price: 200,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    name: "Dr. John Doe",
    specialty: "Neurologist",
    description:
      "Board-certified neurologist specializing in stroke prevention and treatment of neurological disorders.",
    badges: [
      { icon: <Brain size={14} />, label: "Neurology" },
      { icon: <Activity size={14} />, label: "Stroke" },
    ],
    availability: ["tuesday", "thursday", "saturday"],
    price: 250,
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    name: "Dr. Emily Brown",
    specialty: "Pediatrician",
    description:
      "Compassionate pediatrician with a focus on child development and preventive care.",
    badges: [
      { icon: <Baby size={14} />, label: "Child Health" },
      { icon: <Activity size={14} />, label: "Vaccines" },
    ],
    availability: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    price: 180,
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    description:
      "Experienced cardiologist with over 15 years of practice. Specializes in preventive cardiology and heart disease management.",
    badges: [
      { icon: <Heart size={14} />, label: "Heart Disease" },
      { icon: <Activity size={14} />, label: "Tension" },
    ],
    availability: ["monday", "wednesday", "friday"],
    price: 200,
  },
  {
    id: "5",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    name: "Dr. John Doe",
    specialty: "Neurologist",
    description:
      "Board-certified neurologist specializing in stroke prevention and treatment of neurological disorders.",
    badges: [
      { icon: <Brain size={14} />, label: "Neurology" },
      { icon: <Activity size={14} />, label: "Stroke" },
    ],
    availability: ["tuesday", "thursday", "saturday"],
    price: 250,
  },
  {
    id: "6",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    name: "Dr. Emily Brown",
    specialty: "Pediatrician",
    description:
      "Compassionate pediatrician with a focus on child development and preventive care.",
    badges: [
      { icon: <Baby size={14} />, label: "Child Health" },
      { icon: <Activity size={14} />, label: "Vaccines" },
    ],
    availability: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    price: 180,
  },
  {
    id: "7",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    description:
      "Experienced cardiologist with over 15 years of practice. Specializes in preventive cardiology and heart disease management.",
    badges: [
      { icon: <Heart size={14} />, label: "Heart Disease" },
      { icon: <Activity size={14} />, label: "Tension" },
    ],
    availability: ["monday", "wednesday", "friday"],
    price: 200,
  },
  {
    id: "8",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    name: "Dr. John Doe",
    specialty: "Neurologist",
    description:
      "Board-certified neurologist specializing in stroke prevention and treatment of neurological disorders.",
    badges: [
      { icon: <Brain size={14} />, label: "Neurology" },
      { icon: <Activity size={14} />, label: "Stroke" },
    ],
    availability: ["tuesday", "thursday", "saturday"],
    price: 250,
  },
  {
    id: "9",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    name: "Dr. Emily Brown",
    specialty: "Pediatrician",
    description:
      "Compassionate pediatrician with a focus on child development and preventive care.",
    badges: [
      { icon: <Baby size={14} />, label: "Child Health" },
      { icon: <Activity size={14} />, label: "Vaccines" },
    ],
    availability: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    price: 180,
  },
];

export function DoctorListPage() {
  const dispatch = useAppDispatch();
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);

  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState<string>("All Specialties");
  const [availability, setAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(specialty);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const filteredDoctors = doctors.filter((doctor) => {
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (specialty === "All Specialties" || doctor.specialty === specialty) &&
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
                "Pediatrician",
                "Oncology",
              ]}
              placeholder="Select specialty"
              value={specialty}
              onChange={(value) => setSpecialty(value || "All Specialties")}
              leftSection={<Filter size={16} />}
              size="md"
            />
          </Group>

          <Accordion>
            <Accordion.Item value="advanced-filters">
              <Accordion.Control>Advanced Filters</Accordion.Control>
              <Accordion.Panel>
                <Grid>
                  <Grid.Col className="justify-center items-center">
                    <Text size="sm" fw={500} mb="xs">
                      Availability
                    </Text>
                    <Checkbox.Group
                      value={availability}
                      onChange={setAvailability}
                    >
                      <Group className="flex justify-center items-center mt-5 ">
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
                      className="mb-2"
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
