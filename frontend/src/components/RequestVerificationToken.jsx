import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { RequestVerificationTokenSchema } from "../validations/ValidationSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  requestVerificationToken,
} from "../redux/actions/authActions";
import Fade from "react-reveal/Fade";

const RequestVerificationToken = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const initialFormValues = {
    email: location.state || "",
  };

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: initialFormValues,
      validationSchema: RequestVerificationTokenSchema,
      onSubmit: async (values, actions) => {
        const res = await dispatch(
          location.pathname === "/auth/forgot-password"
            ? forgotPassword(values)
            : requestVerificationToken(values)
        );
        if (res === "success") {
          await navigate("/auth/reset-password", { state: values.email });
        } else if (res === "token sent") {
          await navigate("/auth/verify-email");
        }
      },
    });

  return (
    <Fade>
      <Form
        className="auth-form px-xxl-4 px-md-0 px-sm-5 px-3"
        id="form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2
          style={{ color: "#DD995F" }}
          className="fs-2 text-dark-color font-montserrat fw-bold text-capitalize mt-5 mb-4"
        >
          Verify Your Account
        </h2>

        <p className="font-montserrat text-dark-grey mt-3">
          Please enter your email address here, then we will send you a
          verification token via email.
        </p>
        <Form.Group className="mb-3">
          <Row className="justify-content-between align-items-center">
            <Form.Label htmlFor="email" className="cursor-pointer">
              Email
            </Form.Label>
            <Col xs={12}>
              <Form.Group>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  className={
                    errors.email && touched.email
                      ? "inputField-error"
                      : values.email && !errors.email
                      ? "inputField-success"
                      : null
                  }
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} className="mt-2">
              <Button
                disabled={loading}
                className="signinbtn btn-brown-square"
                type="submit"
              >
                <div className="button-content">
                  {loading && <Spinner className="me-2" animation="border" />}
                  Send Verification Token
                </div>
              </Button>
            </Col>
            {errors.email && touched.email ? (
              <span className="d-block validation-error-message mt-1">
                {errors.email}
              </span>
            ) : null}
          </Row>
        </Form.Group>
      </Form>
    </Fade>
  );
};

export default RequestVerificationToken;
