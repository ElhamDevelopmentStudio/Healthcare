import { Dispatch, SetStateAction, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TextInput,
  Select,
  Accordion,
  RangeSlider,
  Checkbox,
  Text,
  Group,
} from "@mantine/core";
import { Search, Filter, Menu } from "lucide-react";

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
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
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
  setSidebarOpen,
}: SidebarProps) {
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.5, 
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { stiffness: 50, duration: 0.5 },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {

        setSidebarOpen(true);
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setSidebarOpen]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 ${
          isSidebarOpen ? "left-80" : "left-4"
        } z-50 p-2 bg-blue-500 text-white rounded-md transition-all duration-300 md:hidden`}
      >
        <Menu size={24} />
      </button>

      <motion.div
        initial="hidden"
        animate={isSidebarOpen ? "visible" : "hidden"}
        exit="exit"
        variants={sidebarVariants}
        className={`fixed top-0 left-0 h-full w-72 bg-[#e6e6e6] shadow-lg z-40 p-6 overflow-y-auto transition-all duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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
          <Accordion.Item value="advanced-filters" className="">
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
  );
}
