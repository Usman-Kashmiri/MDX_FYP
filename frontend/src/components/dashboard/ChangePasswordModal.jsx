import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { UseGetRole } from "../../hooks/auth";
import { useForm, yupResolver } from "@mantine/form";
import { ChangePasswordSchema } from "../../validations/ValidationSchema";
import { changePassword } from "../../redux/actions/userActions";
import { Button, Modal, PasswordInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdOutlineLockReset } from "react-icons/md";

const ChangePasswordModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();
  const role = UseGetRole();

  const { loading } = useSelector((state) => state.user);

  const form = useForm({
    initialValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    validateInputOnBlur: true,
    validateInputOnChange: [
      "current_password",
      "password",
      "password_confirmation",
    ],
    validate: yupResolver(ChangePasswordSchema),
  });

  const handleClose = () => {
    form.reset();
    close();
  };

  const handleSubmit = async () => {
    const res = await dispatch(changePassword(role, form.values));
    if (res === "success") {
      handleClose();
    }
  };

  return (
    <>
      <Button
        type="button"
        sx={{
          backgroundColor: "#db9651",
          transition: "0.6s ease-out",
          height: 42,
          span: {
            display: "flex",
            justifyContent: "center",
            gap: 6,
          },
          svg: {
            width: "1.5rem",
            height: "1.5rem",
            transition: "0.4s ease-out",
            transform: "rotate(0deg) scale(1)",
          },
          "&:hover": {
            backgroundColor: "#d28b16",
            svg: {
              transform: "rotate(-20deg) scale(1.05)",
            },
          },
        }}
        variant="filled"
        onClick={open}
      >
        <MdOutlineLockReset /> Change Password
      </Button>
      <Modal
        opened={opened}
        onClose={handleClose}
        title="Change Password"
        centered
        closeOnClickOutside={false}
      >
        <form autoComplete="off" onSubmit={form.onSubmit(handleSubmit)}>
          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            className="mb-4"
            {...form.getInputProps("current_password")}
            withAsterisk
          />
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            className="mb-4"
            {...form.getInputProps("password")}
            withAsterisk
          />
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            className="mb-4"
            {...form.getInputProps("password_confirmation")}
            withAsterisk
          />
          <div className="d-flex justify-content-end gap-3">
            <Button onClick={handleClose} variant="outline" color="gray">
              Cancel
            </Button>
            <Button
              type="Submit"
              sx={{
                backgroundColor: "#db9651",
                "&:hover": { backgroundColor: "#d28b13" },
              }}
              variant="filled"
              loading={loading}
              loaderProps={{ color: "#fff" }}
            >
              Update
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
