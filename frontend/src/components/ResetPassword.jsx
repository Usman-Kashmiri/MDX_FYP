import { useFormik } from "formik";
import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { ResetPasswordSchema } from "../validations/ValidationSchema";
import { login, resetPassword } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import Fade from "react-reveal/Fade";

const ResetPassword = () => {
  const location = useLocation();

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const initialFormValues = {
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: initialFormValues,
      validationSchema: ResetPasswordSchema,
      onSubmit: async (values, actions) => {
        // console.log({ ...values, email: location.state });
        const res = await dispatch(
          resetPassword({ ...values, email: location.state })
        );
        if (res === "success") {
          await dispatch(
            login({ email: location.state, password: values.password })
          );
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
        {/* {error && (
        <div className="position-fixed mt-4 d-flex w-100 justify-content-center z-3 start-0 top-0">
          <Alert className="my-2" variant="danger">
            {error}
          </Alert>
        </div>
      )} */}
        <h2
          style={{ color: "#DD995F" }}
          className="fs-2 text-dark-color font-montserrat fw-bold text-capitalize mt-5 mb-4"
        >
          Reset Password
        </h2>

        <p className="font-montserrat text-dark-grey mt-3">
          A reset password token has been sent to you, Please check your email
          inbox. Do not forget to check your spam folder as well.
        </p>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="token">Token</Form.Label>
          <Form.Control
            type="text"
            id="token"
            name="token"
            placeholder="Enter token"
            className={`w-100 ${
              errors.token && touched.token
                ? "inputField-error"
                : values.token && !errors.token
                ? "inputField-success"
                : null
            }`}
            value={values.token}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.token && touched.token ? (
            <span className="d-block validation-error-message">
              {errors.token}
            </span>
          ) : null}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <div className="d-flex justify-content-end position-relative">
            <Form.Control
              type={!showPassword ? "password" : "text"}
              className={
                errors.password && touched.password
                  ? "inputField-error"
                  : values.password && !errors.password
                  ? "inputField-success"
                  : null
              }
              placeholder="Password"
              id="password"
              name="password"
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <i
              className={`far ${
                !showPassword ? "fa-eye-slash" : "fa-eye"
              } position-absolute eye-icon cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          {errors.password && touched.password ? (
            <span className="d-block validation-error-message mt-1">
              {errors.password}
            </span>
          ) : null}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password_confirmation">
            Confirm Password
          </Form.Label>
          <div className="d-flex justify-content-end position-relative">
            <Form.Control
              type={!showConfirmPassword ? "password" : "text"}
              className={
                errors.password_confirmation && touched.password_confirmation
                  ? "inputField-error"
                  : values.password_confirmation &&
                    !errors.password_confirmation
                  ? "inputField-success"
                  : null
              }
              placeholder="Confirm Password"
              id="password_confirmation"
              name="password_confirmation"
              value={values.password_confirmation}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <i
              className={`far ${
                !showConfirmPassword ? "fa-eye-slash" : "fa-eye"
              } position-absolute eye-icon cursor-pointer`}
              onClick={() => setConfirmShowPassword(!showConfirmPassword)}
            ></i>
          </div>
          {errors.password_confirmation && touched.password_confirmation ? (
            <span className="d-block validation-error-message mt-1">
              {errors.password_confirmation}
            </span>
          ) : null}
        </Form.Group>

        <div className="signinsubmitbtndiv mt-4">
          <Button disabled={loading} className="signinbtn" type="submit">
            {loading && <Spinner animation="border" />}
            Reset Password
          </Button>
        </div>
      </Form>
    </Fade>
  );
};

export default ResetPassword;
