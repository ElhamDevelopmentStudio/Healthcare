import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Group,
  Stack,
  Title,
  Card,
  Container,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { AnimatePresence } from "framer-motion";
import { format, addDays, startOfWeek } from "date-fns";
import {
  selectAppointments,
  Appointment,
  cancelAppointment,
  removeAppointment,
  updateAppointment,
} from "../../redux/slices/AppointmentSlice";
import { RootState } from "../../redux/store";
import AppointmentCard from "./AppointmentCard";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface GroupedAppointments {
  [key: string]: Appointment[];
}

interface KanbanAppointmentBoardProps {
  onReschedule: (appointment: Appointment) => void;
}

const KanbanAppointmentBoard: React.FC<KanbanAppointmentBoardProps> = ({
  onReschedule,
}) => {
  const dispatch = useDispatch();
  const theme = useMantineTheme();
  const appointments = useSelector((state: RootState) =>
    selectAppointments(state)
  );
  const [groupedAppointments, setGroupedAppointments] =
    useState<GroupedAppointments>({});

  // @ts-expect-error ignore
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );

  useEffect(() => {
    // @ts-expect-error ignore
    const grouped = DAYS_OF_WEEK.reduce((acc, day, index) => {
      const currentDate = addDays(currentWeekStart, index);
      acc[format(currentDate, "yyyy-MM-dd")] = appointments.filter((app) => {
        const appDate = new Date(app.date);
        return (
          format(appDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
        );
      });
      return acc;
    }, {} as GroupedAppointments);
    setGroupedAppointments(grouped);
  }, [appointments, currentWeekStart]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { destination, draggableId } = result;
    const appointment = appointments.find((app) => app.id === draggableId);

    if (appointment) {
      const newDate = addDays(
        currentWeekStart,
        parseInt(destination.droppableId)
      );
      const updatedAppointment = {
        ...appointment,
        date: format(newDate, "yyyy-MM-dd"),
      };
      dispatch(updateAppointment(updatedAppointment));
    }
  };

  const handleCancel = (id: string) => {
    dispatch(cancelAppointment(id));
  };

  const handleRemove = (id: string) => {
    dispatch(removeAppointment(id));
  };

  return (
    <Container fluid style={{ maxWidth: "1600px", margin: "0 auto" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Stack gap="xl">
          {[0, 1].map((row) => (
            <Group key={row} align="flex-start" grow gap="xl">
              {DAYS_OF_WEEK.slice(row * 4, (row + 1) * 4).map((day, index) => {
                const actualIndex = row * 4 + index;
                const currentDate = addDays(currentWeekStart, actualIndex);
                const dateKey = format(currentDate, "yyyy-MM-dd");
                return (
                  <Droppable
                    key={actualIndex}
                    droppableId={actualIndex.toString()}
                  >
                    {(provided, snapshot) => (
                      <Card
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={{
                          minHeight: "500px",
                          backgroundColor: snapshot.isDraggingOver
                            ? theme.colors.blue[0]
                            : theme.white,
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <Title
                          order={3}
                          ta="center"
                          mb="md"
                          style={{ color: theme.colors.blue[6] }}
                        >
                          {day}
                        </Title>
                        <Text size="sm" color="dimmed" ta="center" mb="md">
                          {format(currentDate, "MMMM d, yyyy")}
                        </Text>
                        <Stack gap="md">
                          <AnimatePresence>
                            {groupedAppointments[dateKey]?.map(
                              (appointment, index) => (
                                <Draggable
                                  key={appointment.id}
                                  draggableId={appointment.id}
                                  index={index}
                                >
                                  {
                                    // @ts-expect-error ignore
                                    (provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <AppointmentCard
                                          appointment={appointment}
                                          onReschedule={onReschedule}
                                          onCancel={handleCancel}
                                          onRemove={handleRemove}
                                        />
                                      </div>
                                    )
                                  }
                                </Draggable>
                              )
                            )}
                          </AnimatePresence>
                        </Stack>
                        {provided.placeholder}
                      </Card>
                    )}
                  </Droppable>
                );
              })}
            </Group>
          ))}
        </Stack>
      </DragDropContext>
    </Container>
  );
};

export default KanbanAppointmentBoard;
