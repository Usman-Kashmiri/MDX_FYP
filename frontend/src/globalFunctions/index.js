import { notifications } from "@mantine/notifications";
import { IconExclamationMark } from "@tabler/icons-react";
import { IconCheck, IconX } from "@tabler/icons-react";

export const successMessage = (msg) => {
  notifications.show({
    id: "success-notification",
    withCloseButton: true,
    autoClose: 4000,
    title: msg,
    color: "green",
    icon: <IconCheck />,
    className: "success-notification",
    loading: false,
    position: "top-center",
  });
};

export const errorMessage = (error) => {
  notifications.show({
    id: "failure-notification",
    withCloseButton: true,
    autoClose: 4000,
    message: error || "Internal Server Error",
    color: "red",
    icon: <IconX />,
    className: "failure-notification",
    loading: false,
    position: "top-center",
  });
};

export const warningMessage = (error) => {
  notifications.show({
    id: "warning-notification",
    withCloseButton: true,
    autoClose: 3500,
    message: error || "Internal Server Error",
    color: "yellow",
    icon: <IconExclamationMark />,
    className: "warning-notification",
    loading: false,
  });
};
