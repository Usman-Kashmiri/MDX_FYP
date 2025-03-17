import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { TokenFormSchema } from "../validations/ValidationSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  requestVerificationToken,
  verifyEmail,
} from "../redux/actions/authActions";
import Fade from "react-reveal/Fade";
import { Box, Flex, Grid, Input } from "@mantine/core";

const VerifyAccount = () => {
  const [resendToken, setResendToken] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const initialFormValues = {
    token: "",
  };

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }

    setTimeout(() => {
      setResendToken(true);
    }, 1000 * 60);
  }, [error, dispatch]);

  const handleResendToken = () => {
    dispatch(requestVerificationToken(location.state));
  };

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: initialFormValues,
      validationSchema: TokenFormSchema,
      onSubmit: async (values, actions) => {
        const res = await dispatch(verifyEmail(values));
        if (res.res === "success") {
          setResendToken(false);
          const role = res?.user?.role?.replace("Super", "")?.toLowerCase();
          navigate(`/${role}/account-settings`);
        } else if (res === "resend token") {
          setResendToken(true);
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
          Please check your email inbox to confirm your account. Do not forget
          to check your spam folder as well.
          <br />
          <span style={{ color: "red" }}>
            Note: The token will expire in 10 minutes.
          </span>
        </p>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="token">Token</Form.Label>
          <Flex
            justify="space-between"
            align={"center"}
            w={"100%"}
            wrap={"wrap"}
          >
            <Box
              sx={{
                width: "62%",
                "@media screen and (max-width:480px)": {
                  width: "55%",
                },
              }}
            >
              <Input
                type="text"
                id="token"
                name="token"
                placeholder="Enter token"
                className={`w-100 ${
                  errors.token && touched.token
                    ? "inputField-error"
                    : values.token && !errors.token
                    ? "inputField-success"
                    : ""
                } token-field`}
                error={errors.token && "Token is required"}
                value={values.token}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Box>
            <Box
              sx={{
                width: "38%",
                "@media screen and (max-width:480px)": {
                  width: "45%",
                },
              }}
            >
              <div className="d-flex flex-row justify-content-end">
                <div
                  className="max-w-md-100 max-w-50"
                  // style={{
                  //   maxWidth: "50%",
                  // }}
                >
                  <Button
                    disabled={loading}
                    className="signinbtn btn-of-datatable"
                    type="submit"
                  >
                    {loading && <Spinner animation="border" />}
                    Verify Token
                  </Button>
                </div>
              </div>
            </Box>
          </Flex>
          {/* {errors.token && touched.token ? (
              <span className="d-block validation-error-message">
                {errors.token}
              </span>
            ) : null} */}
          {resendToken && (
            <Box className="w-100 resend-text mt-2" onClick={handleResendToken}>
              Resend Verification Token
            </Box>
          )}
        </Form.Group>
      </Form>
    </Fade>
  );
};

export default VerifyAccount;
