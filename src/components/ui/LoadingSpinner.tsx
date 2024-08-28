import React from "react";
import { Loader, Center } from "@mantine/core";

export const LoadingSpinner: React.FC = () => (
  <Center style={{ height: "100vh" }}>
    <Loader size="xl" />
  </Center>
);
