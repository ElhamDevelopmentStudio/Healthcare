import { Dispatch, SetStateAction } from "react";
import {
  TextInput,
  Select,
  Accordion,
  RangeSlider,
  Checkbox,
  Text,
  Group,
  Drawer,
  Button,
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
  return (
    <>
      <Button
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 p-2 transition-all duration-300 ${
          isSidebarOpen ? "left-96" : "left-4"
        }`}
        variant="filled"
        color="blue"
        radius="md"
        style={{ position: "fixed" }}
      >
        {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </Button>

      <Drawer
        opened={isSidebarOpen}
        onClose={toggleSidebar}
        padding="md"
        size="sm"
        title="Filters"
        classNames={{
          title: "text-gray-700 text-[8vh]",
        }}
        position="left"
        withCloseButton={false}
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
            "Cardiologist",
            "Dermatologist",
            "Pediatrician",
            "Orthopedic Surgeon",
            "Endocrinologist",
            "Neurologist",
            "Gynecologist",
            "Psychiatrist",
            "Ophthalmologist",
            "Dentist",
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
      </Drawer>
    </>
  );
}
