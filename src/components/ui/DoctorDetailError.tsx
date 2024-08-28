import React from "react";
import { Alert } from "@mantine/core";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
    {message}
  </Alert>
);
