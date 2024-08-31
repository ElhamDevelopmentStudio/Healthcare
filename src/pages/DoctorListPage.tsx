import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Center, Container, Group, Pagination } from "@mantine/core";
import {
  fetchDoctors,
  selectAllDoctors,
  Doctor,
} from "../redux/slices/DoctorSlice";
import { RootState, useAppDispatch } from "../redux/store";
import { Sidebar } from "../components/ui/FiltersSidebar";
import { DoctorList } from "../components/ui/DoctorList";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorDisplay } from "../components/ui/DoctorDetailError";

export function DoctorListPage() {
  const dispatch = useAppDispatch();
  const doctors: Doctor[] = useSelector(selectAllDoctors);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const status = useSelector((state: RootState) => state.doctors.status);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  const filteredDoctors = doctors.filter((doctor) => {
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!specialty || doctor.specialty === specialty) &&
      (availability.length === 0 ||
        availability.some((day) => doctor.availability.includes(day))) &&
      doctor.price >= priceRange[0] &&
      doctor.price <= priceRange[1]
    );
  });

  const pageSize = 9;
  const pageCount = Math.ceil(filteredDoctors.length / pageSize);
  const displayedDoctors = filteredDoctors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (status === "loading") {
    return (
      <Center style={{ height: "100vh" }}>
        <LoadingSpinner />
      </Center>
    );
  }

  if (status === "failed") {
    return (
      <Center style={{ height: "100vh" }}>
        <ErrorDisplay message="Error loading doctors. Please try again later." />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <div className="flex">
        <Sidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          specialty={specialty}
          setSpecialty={setSpecialty}
          availability={availability}
          setAvailability={setAvailability}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div
          className={`w-full transition-all duration-300 ${
            isSidebarOpen ? "md:ml-80" : ""
          }`}
        >
          <div
            className={`relative ${
              isSidebarOpen ? "md:blur-none blur-sm" : ""
            }`}
          >
            <DoctorList displayedDoctors={displayedDoctors} />

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
          </div>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={toggleSidebar}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
