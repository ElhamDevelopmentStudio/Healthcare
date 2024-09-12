import React, { useState, useEffect } from "react";
import { Drawer, Stack, MultiSelect, Switch, Button } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { parse } from "date-fns";
import { Doctor } from "../../../redux/slices/DoctorSlice";

interface FilterDrawerProps {
  opened: boolean;
  onClose: () => void;
  doctors: Doctor[];
  currentFilters: {
    selectedDoctors: string[];
    selectedDate: Date | null;
    selectedTimeRange: [Date | null, Date | null];
    showCancelled: boolean;
  };
  onApplyFilters: (newFilters: FilterDrawerProps["currentFilters"]) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  opened,
  onClose,
  doctors,
  currentFilters,
  onApplyFilters,
}) => {
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>(
    currentFilters.selectedDoctors
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    currentFilters.selectedDate
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [Date | null, Date | null]
  >(currentFilters.selectedTimeRange);
  const [showCancelled, setShowCancelled] = useState(
    currentFilters.showCancelled
  );

  useEffect(() => {
    setSelectedDoctors(currentFilters.selectedDoctors);
    setSelectedDate(currentFilters.selectedDate);
    setSelectedTimeRange(currentFilters.selectedTimeRange);
    setShowCancelled(currentFilters.showCancelled);
  }, [currentFilters]);

  const handleApplyFilters = () => {
    onApplyFilters({
      selectedDoctors,
      selectedDate,
      selectedTimeRange,
      showCancelled,
    });
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Filter Appointments"
      padding="xl"
      size="lg"
    >
      <Stack gap="md">
        <MultiSelect
          label="Doctors"
          placeholder="Search and select doctors"
          data={doctors.map((doctor) => ({
            value: doctor.id,
            label: `Dr. ${doctor.name}`,
          }))}
          value={selectedDoctors}
          onChange={setSelectedDoctors}
          searchable
          nothingFoundMessage="No doctors found"
          clearable
        />
        <DatePickerInput
          label="Date"
          placeholder="Select date"
          value={selectedDate}
          onChange={setSelectedDate}
          clearable
        />
        <TimeInput
          label="Start Time"
          placeholder="Select start time"
          value={selectedTimeRange[0]?.toTimeString().slice(0, 5) || ""}
          onChange={(event) =>
            setSelectedTimeRange([
              parse(event.currentTarget.value, "HH:mm", new Date()),
              selectedTimeRange[1],
            ])
          }
        />
        <TimeInput
          label="End Time"
          placeholder="Select end time"
          value={selectedTimeRange[1]?.toTimeString().slice(0, 5) || ""}
          onChange={(event) =>
            setSelectedTimeRange([
              selectedTimeRange[0],
              parse(event.currentTarget.value, "HH:mm", new Date()),
            ])
          }
        />
        <Switch
          label="Show Cancelled Appointments"
          checked={showCancelled}
          onChange={(event) => setShowCancelled(event.currentTarget.checked)}
        />
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </Stack>
    </Drawer>
  );
};

export default FilterDrawer;
