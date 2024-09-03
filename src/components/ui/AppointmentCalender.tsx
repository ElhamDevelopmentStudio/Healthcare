// @ts-nocheck
import React, { useState } from "react";
import { ColorSwatch, Popover, Text, Stack, Group, Badge } from "@mantine/core";
import { format } from "date-fns";
import { Calendar } from "@mantine/dates";
import { Appointment } from "../../redux/slices/AppointmentSlice";
import { useSelector } from "react-redux";
import { selectAllDoctors } from "../../redux/slices/DoctorSlice";

import "@mantine/dates/styles.css";

interface AppointmentCalendarProps {
  appointments: Appointment[];
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const doctors = useSelector(selectAllDoctors);

  const renderDay = (date: Date) => {
    const dayAppointments = appointments.filter(
      (appointment) =>
        format(new Date(appointment.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
    const hasAppointments = dayAppointments.length > 0;

    return (
      <Popover width={300} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <div>
            <Text ta="center">{date.getDate()}</Text>
            {hasAppointments && (
              <ColorSwatch size={8} radius="xl" mx="auto" color="blue" />
            )}
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap="xs">
            {dayAppointments.map((appointment) => {
              const doctor = doctors.find(
                (doc) => doc.id === appointment.doctorId
              );

              return (
                <Group key={appointment.id} align="center" wrap="">
                  <Text size="sm" fw={500}>
                    {appointment.time} - Dr. {doctor ? doctor.name : "Unknown"}
                  </Text>
                  <Badge
                    size="sm"
                    className="mr-5"
                    color={appointment.cancelled ? "red" : "blue"}
                  >
                    {appointment.cancelled ? "Cancelled" : "Active"}
                  </Badge>
                </Group>
              );
            })}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    );
  };

  return (
    <Calendar
      value={selectedDate}
      onChange={setSelectedDate}
      renderDay={renderDay}
    />
  );
};

export default AppointmentCalendar;
