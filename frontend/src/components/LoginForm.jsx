import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import googleimg from "../assets/images/google.png";
import facebookimg from "../assets/images/facebook.png";
import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";
import { useFormik } from "formik";
import { LoginFormSchema } from "../validations/ValidationSchema";
import { Button, Checkbox, PasswordInput, TextInput } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../redux/actions/authActions";
import Fade from "react-reveal/Fade";

const LoginForm = () => {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [verifyEmail, setVerifyEmail] = useState(false);

  const initialFormValues = {
    email: localStorage.getItem("email") || "",
    password: localStorage.getItem("password")
      ? window.atob(localStorage.getItem("password"))
      : "",
    remember_me:
      localStorage.getItem("email") && localStorage.getItem("password")
        ? true
        : false,
  };

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const handleVerifyEmail = () => {
    navigate("/auth/request-verification", { state: values.email });
  };

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: initialFormValues,
      validationSchema: LoginFormSchema,
      onSubmit: async (values) => {
        const res = await dispatch(login(values));
        if (res.token) {
          if (
            res?.user?.role === "Client" &&
            locationState === "/legal-professionals"
          ) {
            navigate(locationState);

            return true;
          }

          navigate(
            `/${res?.user?.role.replace("Super", "").toLowerCase()}/dashboard`
          );

          return true;
        } else if (res === "not verified") {
          setVerifyEmail(true);
        }
      },
    });

  return (
    <Fade>
      <Form
        className="auth-form px-xxl-4 px-md-0 px-sm-5 px-0"
        id="form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2
          style={{ color: "#DD995F" }}
          className="fs-2 text-dark-color font-montserrat fw-bold text-capitalize mt-5 mb-4"
        >
          sign in
        </h2>

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
          className="mb-3"
          error={errors.password && touched.password ? errors.password : null}
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <Col xs={12} className="d-flex justify-content-between">
          <Form.Group className="mb-3">
            <Checkbox
              label="Remember Me"
              id="remember_me"
              name="remember_me"
              checked={values.remember_me}
              onBlur={handleBlur}
              onChange={handleChange}
              className="signup-checkbox remember-me"
            />
          </Form.Group>

          <Link
            to="/auth/forgot-password"
            state={values?.email}
            className="forgottext"
          >
            Forgot password?
          </Link>
        </Col>
        {verifyEmail && (
          <span className="resend-text mt-2" onClick={handleVerifyEmail}>
            Verify Email
          </span>
        )}
        <div className="signinsubmitbtndiv mt-5">
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
            Sign In
          </Button>
        </div>
        <div className="createnewaccount">
          <p style={{ color: "#5E5E5E", fontSize: "15px" }}>
            Create a new account? Click
            <span
              style={{ color: "#DCA74D", cursor: "pointer" }}
              onClick={() => navigate("/auth/signup")}
            >
              {" "}
              here
            </span>{" "}
            to register.
          </p>
        </div>
        <div className="logosdiv gap-1">
          <img
            src={googleimg}
            alt="google icon"
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
          <img
            src={facebookimg}
            alt="facebook icon"
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
        </div>
      </Form>
    </Fade>
  );
};

export default LoginForm;
