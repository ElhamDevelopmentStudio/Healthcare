import React from "react";
import { Stack, Tabs, Text } from "@mantine/core";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import AppointmentCard from "../Cards/AppointmentCard";
import { useSelector } from "react-redux";
import { selectCanceledAppointments } from "../../../redux/slices/AppointmentSlice"; // Redux selector for canceled appointments
import { Appointment } from "../../../redux/slices/AppointmentSlice";
import { isBefore, startOfToday, isToday } from "date-fns";

interface AppointmentListProps {
  appointments: Appointment[];
  onReschedule: (appointment: Appointment) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onReschedule,
  onCancel,
  onRemove,
}) => {
  const now = new Date();

  const futureAppointments = appointments.filter(
    (appointment) =>
      !appointment.cancelled &&
      (isBefore(now, new Date(appointment.date)) ||
        isToday(new Date(appointment.date)))
  );

  const pastAppointments = appointments.filter(
    (appointment) =>
      !appointment.cancelled &&
      isBefore(new Date(appointment.date), startOfToday())
  );

  const cancelledAppointments = useSelector(selectCanceledAppointments);

  return (
    <Tabs defaultValue="future">
      <Tabs.List>
        <Tabs.Tab value="future">Appointments</Tabs.Tab>
        <Tabs.Tab value="past">Past Appointments</Tabs.Tab>
        <Tabs.Tab value="canceled">Canceled Appointments</Tabs.Tab>
      </Tabs.List>

      {/* Future Appointments */}
      <Tabs.Panel value="future" pt="xs">
        <AnimatePresence>
          <LayoutGroup>
            <Stack gap="xl">
              {futureAppointments.length > 0 ? (
                futureAppointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onReschedule={onReschedule}
                      onCancel={onCancel}
                      onRemove={onRemove}
                    />
                  </motion.div>
                ))
              ) : (
                <Text>No future meetings.</Text>
              )}
            </Stack>
          </LayoutGroup>
        </AnimatePresence>
      </Tabs.Panel>

      {/* Past Appointments */}
      <Tabs.Panel value="past" pt="xs">
        <AnimatePresence>
          <LayoutGroup>
            <Stack gap="xl">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onReschedule={onReschedule}
                      onCancel={onCancel}
                      onRemove={onRemove}
                    />
                  </motion.div>
                ))
              ) : (
                <Text>No past meetings.</Text>
              )}
            </Stack>
          </LayoutGroup>
        </AnimatePresence>
      </Tabs.Panel>

      {/* Canceled Appointments */}
      <Tabs.Panel value="canceled" pt="xs">
        <AnimatePresence>
          <LayoutGroup>
            <Stack gap="xl">
              {cancelledAppointments.length > 0 ? (
                cancelledAppointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onReschedule={onReschedule}
                      onCancel={onCancel}
                      onRemove={onRemove}
                    />
                  </motion.div>
                ))
              ) : (
                <Text>No canceled meetings.</Text>
              )}
            </Stack>
          </LayoutGroup>
        </AnimatePresence>
      </Tabs.Panel>
    </Tabs>
  );
};

export default AppointmentList;
