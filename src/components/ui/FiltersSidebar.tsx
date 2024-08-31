import { Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextInput,
  Select,
  Accordion,
  RangeSlider,
  Checkbox,
  Text,
  Group,
  Title,
} from "@mantine/core";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

type SidebarProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  specialty: string | null;
  setSpecialty: Dispatch<SetStateAction<string | null>>;
  availability: string[];
  setAvailability: Dispatch<SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export function Sidebar({
  searchTerm,
  setSearchTerm,
  specialty,
  setSpecialty,
  availability,
  setAvailability,
  priceRange,
  setPriceRange,
  isSidebarOpen,
  toggleSidebar,
}: SidebarProps) {
  const sidebarVariants = {
    expanded: { width: "18rem", x: 0 },
    collapsed: { width: 0, x: "-100%" },
  };

  const contentVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -20 },
  };

  const buttonVariants = {
    expanded: { left: "18rem" },
    collapsed: { left: 0 },
  };

  return (
    <>
      <motion.button
        onClick={toggleSidebar}
        className="fixed top-4 z-50 p-2 bg-blue-500 text-white rounded-r-md transition-all duration-300"
        initial="collapsed"
        animate={isSidebarOpen ? "expanded" : "collapsed"}
        variants={buttonVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {!isSidebarOpen ? (
          <ChevronRight size={24} />
        ) : (
          <ChevronLeft size={24} />
        )}
      </motion.button>

      <motion.div
        className="fixed top-0 left-0 h-full bg-gray-100 shadow-lg z-40 overflow-hidden"
        initial="collapsed"
        animate={isSidebarOpen ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <Title className="pt-4 text-gray-700 ">Filters</Title>
              <motion.div
                className="p-6 overflow-y-auto h-full"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
                transition={{ duration: 0.2 }}
              >
                <TextInput
                  leftSection={<Search size={16} />}
                  placeholder="Search doctors by name"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.currentTarget.value)}
                  size="md"
                  className="mb-6"
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
                  className="mb-6"
                />
                <Accordion>
                  <Accordion.Item value="advanced-filters">
                    <Accordion.Control>Advanced Filters</Accordion.Control>
                    <Accordion.Panel>
                      <Text size="sm" fw={500} mb="xs">
                        Availability
                      </Text>
                      <Checkbox.Group
                        value={availability}
                        onChange={setAvailability}
                        className="mb-6"
                      >
                        <Group>
                          <Checkbox value="monday" label="Mon" />
                          <Checkbox value="tuesday" label="Tue" />
                          <Checkbox value="wednesday" label="Wed" />
                          <Checkbox value="thursday" label="Thu" />
                          <Checkbox value="friday" label="Fri" />
                        </Group>
                      </Checkbox.Group>
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
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
