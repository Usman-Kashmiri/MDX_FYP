import { Button, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminInfo } from "../../redux/actions/userActions";
import { useForm } from "@mantine/form";
import UpdateProfilePicture from "../../components/dashboard/UpdateProfilePicture";
import { UseGetRole } from "../../hooks/auth";
import ChangePasswordModal from "../../components/dashboard/ChangePasswordModal";

import Fade from "react-reveal/Fade";
const ManageProfile = () => {
  const role = UseGetRole();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isLoading, setLoading] = useState(false);

  const [editState, setEditState] = useState(0);

  const handleEditState = (value) => {
    setEditState(value);
  };

  const handleCancel = () => {
    setEditState(0);
  };

  const form = useForm({
    initialValues: {
      first_name: user.userData.first_name,
      last_name: user.userData.last_name,
      email: user.userData.email,
    },
    validateInputOnBlur: true,
    validateInputOnChange: ["first_name", "last_name", "email"],
    validate: {
      first_name: (value) =>
        value.length < 2 ? "First name is too short" : null,
      last_name: (value) =>
        value.length < 2 ? "Last name is too short" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(updateAdminInfo(form.values));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Fade>
      <Container className="pb-md-5 pb-0 mb-md-5 px-md-4 px-3">
        <h2 className="mb-5 text-center">Manage Profile</h2>
        <Row className="flex-column align-items-center px-md-0 px-3 gap-3">
          <Col lg={10} md={8} className="mb-4 d-flex justify-content-end px-0">
            <ChangePasswordModal />
          </Col>
          <Col lg={10} md={8} className="mb-4 manage-profile-form">
            <UpdateProfilePicture
              editState={editState}
              handleEditState={handleEditState}
              handleCancel={handleCancel}
              userRole={role}
            />
          </Col>
          <form
            onSubmit={form.onSubmit(handleFormSubmit)}
            id="manage-profile-form"
            autoComplete="off"
            className="col-lg-10 col-md-8 manage-profile-form"
          >
            <Row>
              <Col sm={6}>
                <TextInput
                  id="first_name"
                  name="first_name"
                  placeholder="Enter your first name"
                  label="First name"
                  withAsterisk
                  {...form.getInputProps("first_name")}
                />
              </Col>
              <Col sm={6}>
                <TextInput
                  id="last_name"
                  name="last_name"
                  placeholder="Enter your last name"
                  label="Last name"
                  className="mt-sm-0 mt-3"
                  withAsterisk
                  {...form.getInputProps("last_name")}
                />
              </Col>
              <TextInput
                id="email"
                name="email"
                disabled={role === "Admin"}
                placeholder="Enter your email address"
                label="Email Address"
                className="mt-3"
                withAsterisk
                {...form.getInputProps("email")}
              />
              <div className="d-flex justify-content-end">
                <Button
                  className="mt-3"
                  type="Submit"
                  sx={{
                    backgroundColor: "#db9651",
                    "&:hover": { backgroundColor: "#d28b13" },
                  }}
                  variant="filled"
                  loading={isLoading}
                >
                  Update
                </Button>
              </div>
            </Row>
          </form>
        </Row>
      </Container>
    </Fade>
  );
};

export default ManageProfile;
