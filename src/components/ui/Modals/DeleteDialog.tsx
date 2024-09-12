import React from "react";
import { Modal, Button, Group, Text } from "@mantine/core";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  titleText: string;
  descriptionText: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onDelete,
  titleText,
  descriptionText,
}) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Text className="text-2xl font-bold text-gray-800 tracking-wide">
          {titleText}
        </Text>
      }
      centered
      overlayProps={{ opacity: 0.75, blur: 4 }}
      transitionProps={{ transition: "fade", duration: 300 }}
      radius="md"
      withCloseButton={false}
      className="p-6 bg-white shadow-lg rounded-xl"
    >
      <div className="flex flex-col space-y-6">
        {/* Description */}
        <Text className="text-gray-600 text-base leading-relaxed tracking-wide">
          {descriptionText}
        </Text>

        {/* Button Group */}
        <Group align="right" gap="lg" className="pt-4">
          {/* Cancel Button */}
          <Button
            variant="outline"
            color="gray"
            size="md"
            className="border-gray-400 text-gray-700 hover:text-gray-900 hover:border-gray-500 transition duration-200 ease-in-out transform hover:scale-105"
            onClick={onClose}
          >
            Cancel
          </Button>

          {/* Delete Button */}
          <Button
            size="md"
            color="red"
            className="bg-[#fa5252] hover:bg-[#f03e3e] text-white shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105"
            onClick={onDelete}
          >
            Delete
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
