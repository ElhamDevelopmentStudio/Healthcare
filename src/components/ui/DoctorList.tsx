import { Grid, Title, Text } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCard } from "./BadgeCard/BadgeCard";
import { Doctor } from "../../redux/slices/DoctorSlice";

type DoctorListProps = {
  displayedDoctors: Doctor[];
};

export function DoctorList({ displayedDoctors }: DoctorListProps) {
  return (
    <>
      <Title order={1} ta="center" mb="xl">
        Find Your Ideal Doctor
      </Title>
      <Text ta="center" size="lg" mb="xl" c="dimmed">
        Discover the perfect healthcare professional tailored to your needs.
      </Text>

      <Grid gutter="xl" justify="center">
        <AnimatePresence>
          {displayedDoctors.map((doctor) => (
            <Grid.Col key={doctor.id} span={{ base: 12, sm: 10, md: 6, lg: 4 }}>
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                    },
                  },
                }}
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
    </>
  );
}
