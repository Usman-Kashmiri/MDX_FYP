import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { signupFormSchema } from "../validations/ValidationSchema";
import { Button, Checkbox, PasswordInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SignUpModal from "./SignUpModal";
import googleimg from "../assets/images/google.png";
import facebookimg from "../assets/images/facebook.png";
import { privacy_policy, terms_of_service } from "../data/data";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  signup,
  register_with,
} from "../redux/actions/authActions";
import Fade from "react-reveal/Fade";

const SelectRole = ({ close, userData }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.auth);
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    if (userData) {
      // setTimeout(() => {
      const userName = userData?.displayName
        ? userData?.displayName.split(" ")
        : ["", ""];
      const roll_id = selectedOption === "lawyer" ? 3 : 4;
      const user = {
        first_name: userName[0],
        last_name: userName[1],
        email: userData.email,
        photoUrl: userData.photoURL,
        terms_of_service: 1,
        role_id: roll_id,
        provider: "google",
      };
      let res = await dispatch(register_with(user));
      if (res) {
        navigate("/auth/login");
        close();
      }
      // }, 2000);
    } else {
      console.error("userData is not available");
    }
  };

  return (
    <div style={{ minWidth: "300px" }}>
      {console.log("loading ", loading)}

      <div>
        <form onSubmit={handle_submit}>
          <label>
            <input
              className="select-role-modal"
              type="radio"
              name="userType"
              value="lawyer"
              checked={selectedOption === "lawyer"}
              onChange={handleOptionChange}
            />
            Lawyer
          </label>
          <br />
          <label>
            <input
              className="select-role-modal"
              type="radio"
              name="userType"
              value="client"
              checked={selectedOption === "client"}
              onChange={handleOptionChange}
            />
            Client
          </label>
          <br />

          <div className="mt-2">
            <Button
              disabled={loading || !selectedOption}
              loading={loading}
              loaderProps={{ color: "#fff" }}
              sx={{
                ":disabled": {
                  backgroundColor: "#d28b13",
                  color: "white",
                  opacity: 0.4,
                },
              }}
              className="signinbtn mb-2"
              type="submit"
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SignupForm = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  // const [googleUser, setGoogleUser] = useState();

  const handleTermsOfServiceModal = (modalType, data) => {
    if (modalType === "tos") {
      setModalTitle("Terms of Services");
      setModalContent(terms_of_service);
    } else if (modalType === "pp") {
      setModalTitle("Privacy Policy");
      setModalContent(privacy_policy);
    } else {
      setModalTitle("Select Role");
      setModalContent(<SelectRole close={close} userData={data} />);
    }
    open();
  };

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
  }, [error, dispatch]);
  const initialFormValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    terms_of_service: false,
    role_id: 4,
  };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: initialFormValues,
    validationSchema: signupFormSchema,
    onSubmit: async (values, actions) => {
      values.terms_of_service
        ? setFieldValue("terms_of_service", 1)
        : setFieldValue("terms_of_service", 0);
      const res = await dispatch(signup(values));
      if (res === "success") {
        await navigate("/auth/verify-email", { state: values.email });
      }
    },
  });

  return (
    <Fade>
      <Form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="auth-form px-xxl-4 px-md-0 px-sm-5 px-3"
      >
        <h2
          style={{ color: "#DD995F" }}
          className="fs-2 text-dark-color font-montserrat fw-bold text-capitalize mt-5 mb-4"
        >
          sign up
        </h2>
        <Row>
          <Col sm={6}>
            <TextInput
              label="First Name"
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Enter First Name"
              className="mb-3"
              error={
                errors.first_name && touched.first_name
                  ? errors.first_name
                  : null
              }
              value={values.first_name}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Col>
          <Col sm={6}>
            <TextInput
              label="Last Name"
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Enter Last Name"
              className="mb-3"
              error={
                errors.last_name && touched.last_name ? errors.last_name : null
              }
              value={values.last_name}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <TextInput
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="Enter email"
          className="mb-3"
          error={errors.email && touched.email ? errors.email : null}
          value={values.email.toLowerCase()}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <PasswordInput
          label="Password"
          id="password"
          name="password"
          placeholder="Password"
          autoComplete="off"
          className="mb-3"
          error={errors.password && touched.password ? errors.password : null}
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <PasswordInput
          label="Confirm Password"
          id="password_confirmation"
          name="password_confirmation"
          placeholder="confirm Password"
          autoComplete="off"
          className="mb-3"
          error={
            errors.password_confirmation && touched.password_confirmation
              ? errors.password_confirmation
              : null
          }
          value={values.password_confirmation}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <Checkbox
          id="terms_of_service"
          name="terms_of_service"
          error={
            errors.terms_of_service && touched.terms_of_service
              ? errors.terms_of_service
              : null
          }
          checked={values.terms_of_service}
          onBlur={handleBlur}
          onChange={handleChange}
          className="signup-checkbox mb-3"
          label={
            <label>
              <label htmlFor="terms_of_service" className="cursor-pointer">
                I agree to the
              </label>{" "}
              <a onClick={() => handleTermsOfServiceModal("tos")}>
                Terms of Service
              </a>{" "}
              <label htmlFor="terms_of_service" className="cursor-pointer">
                and
              </label>{" "}
              <a onClick={() => handleTermsOfServiceModal("pp")}>
                Privacy Policy
              </a>
            </label>
          }
        />

        <SignUpModal
          isOpen={opened}
          isClosed={close}
          modalTittle={modalTitle}
          content={modalContent}
        />

        <Form.Group className="d-flex justify-content-center my-5">
          <>
            <label htmlFor="client" className="radiolabel">
              <input
                id="client"
                name="lawyer"
                type="radio"
                className="me-1 radioinput"
                value={4}
                defaultChecked={values.role_id === 4}
                onChange={(e) => {
                  values.role_id = e.target.value;
                }}
              />
              Client
            </label>

            <label htmlFor="lawyer" className="radiolabel">
              <input
                id="lawyer"
                required
                name="lawyer"
                type="radio"
                className="me-1 radioinput"
                defaultChecked={values.role_id === 3}
                value={3}
                onChange={(e) => {
                  values.role_id = e.target.value;
                }}
              />
              Lawyer
            </label>
          </>
        </Form.Group>

        <div className="signinsubmitbtndiv mt-4">
          <Button
            disabled={loading}
            loading={loading}
            loaderProps={{ color: "#fff" }}
            sx={{
              ":disabled": {
                backgroundColor: "#d28b13",
                color: "white",
                opacity: 0.4,
              },
            }}
            className="signinbtn mb-2"
            type="submit"
          >
            Sign Up
          </Button>
        </div>

        <div className="createnewaccount mt-2">
          <p style={{ color: "#5E5E5E", fontSize: "15px" }}>
            Already a member? Click
            <span
              style={{ color: "#DCA74D", cursor: "pointer" }}
              onClick={() => navigate("/auth/login")}
            >
              {" "}
              here
            </span>{" "}
            sign in
          </p>
        </div>
        <div className="logosdiv gap-1">
          <img
            src={googleimg}
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
          <img
            src={facebookimg}
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
        </div>
      </Form>
    </Fade>
  );
};

export default SignupForm;
