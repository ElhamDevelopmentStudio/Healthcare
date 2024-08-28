import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Group, Pagination } from "@mantine/core";
import {
  fetchDoctors,
  selectAllDoctors,
  Doctor,
} from "../redux/slices/DoctorSlice";
import { useAppDispatch } from "../redux/store";
import { Sidebar } from "../components/ui/FiltersSidebar";
import { DoctorList } from "../components/ui/DoctorList";

export function DoctorListPage() {
  const dispatch = useAppDispatch();
  const doctors: Doctor[] = useSelector(selectAllDoctors);
  console.log("Doctors from landing", doctors);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          setSidebarOpen={setIsSidebarOpen} // Pass down the state setter
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
