import { Link } from "react-router-dom";
import { Button, Container, Title, Text, Space } from "@mantine/core";
import { Home, Search } from "lucide-react";

const ErrorBoundary = () => {
  return (
    <div className="min-h-screen overflow-hidden flex items-center justify-center ">
      <Container className="text-center ">
        <div className="flex flex-col items-center justify-center overflow-hidden ">
          {/* Large 404 Title */}
          <Title order={1} className="text-8xl font-bold text-gray-900 mb-4">
            404
          </Title>

          <Text size="lg" className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist.
          </Text>

          <div className="flex space-x-4">
            <Link to="/">
              <Button variant="filled" color="dark" size="md">
                <Home /> Back to Home
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" color="dark" size="md">
                <Search /> Search Doctors
              </Button>
            </Link>
          </div>

          <Space h="xl" />

          <Text size="sm" className="text-gray-500 mt-8">
            Or you can{" "}
            <Link to="/" className="underline text-gray-900">
              go back to the homepage
            </Link>{" "}
            and start over.
          </Text>
        </div>
      </Container>
    </div>
  );
};

export default ErrorBoundary;
