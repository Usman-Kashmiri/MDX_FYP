import { Button, Text, TextInput, Textarea } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { respondMessage } from "../../redux/actions/adminActions";
import { responseOfMessageForAdminSchema } from "../../validations/ValidationSchema";

const MessageViewForAdmin = () => {
  const location = useLocation();
  const { state } = location;
  const [page, setPage] = useState(5);
  const dispatch = useDispatch();
  const { loaderOfButton } = useSelector((state) => state.admin);

  const form = useForm({
    initialValues: {
      id: state?.id,
      subject: "",
      message: "",
    },
    validateInputOnBlur: true,
    validateInputOnChange: ["subject", "message"],
    validate: yupResolver(responseOfMessageForAdminSchema),
  });

  useEffect(() => {
    form.setFieldValue("id", state?.id);
  }, [state?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await form.validate();
    if (
      Object.keys(form.errors).length === 0 &&
      form?.values?.message &&
      form?.values?.subject
    ) {
      const res = await dispatch(respondMessage(form.values));
      if (res?.res === "success") {
        form.reset();
        // dispatch*) // message details api with id
      }
    }
  };
  return (
    <div className="pt-4 pb-3 px-2 px-sm-4 mb-4">
      <div className="d-flex justify-content-between align-items-center w-100 mb-3">
        {/* <h2 className="mb-0 text-of-transaction mb-3">Message Detail</h2> */}
      </div>

      <div className=" mb-4 mt-3 mx-lg-3 manage-profile-form">
        <Row className=" ">
          <Col xs={12} className="text-of-details mt-3">
            <div>
              <span style={{ fontWeight: "bold", minWidth: "30%" }}>
                Username:{" "}
              </span>
              <span
                className="text-capitalize"
                style={{ marginLeft: "2rem", minWidth: "70%" }}
              >
                {state?.username}
              </span>
            </div>
          </Col>
          <Col xs={12} className="text-of-details mt-3">
            <span style={{ fontWeight: "bold", minWidth: "30%" }}>Email: </span>
            <span style={{ marginLeft: "2rem", minWidth: "70%" }}>
              {state?.email}
            </span>
          </Col>
        </Row>
        <Text className="text-of-details mt-3">
          <span style={{ fontWeight: "bold", minWidth: "30%" }}>Subject: </span>
          <span style={{ marginLeft: "2rem", minWidth: "70%" }}>
            {state?.subject}
          </span>
        </Text>
        <Text className="text-of-details mt-3">
          <span style={{ fontWeight: "bold", minWidth: "30%" }}>Message: </span>
          <span style={{ marginLeft: "2rem", minWidth: "70%" }}>
            {state?.message}
          </span>
        </Text>
        {state?.responses?.length > 0 && (
          <>
            <Col
              xs={12}
              className="sidebar-inner single-blog-author single-blog-reply mt-3 "
            >
              <Text
                Text
                className="text-of-details"
                style={{ fontWeight: "bold" }}
              >
                {state?.responses?.length
                  ? state?.responses?.length === 1
                    ? `${state?.responses?.length} Response:`
                    : `${state?.responses?.length} Responses:`
                  : "0 Response:"}
              </Text>
              {state?.responses?.slice(0, page)?.map((response, i) => {
                return (
                  <Row
                    key={i}
                    style={{ marginLeft: "2rem" }}
                    className="recent-post single-blog-author-post single-blog-reply-post mt-4"
                  >
                    <Col
                      className={`w-100 blog-reply-content ${
                        i === state?.responses?.length - 1 && "border-bottom-0"
                      }`}
                    >
                      <h4>{`${moment(response?.created_at).format(
                        "MMM"
                      )} ${moment(response?.created_at).format("DD")}, ${moment(
                        response?.created_at
                      ).format("YYYY")} - ${moment(response?.created_at).format(
                        "hh"
                      )}:${moment(response?.created_at).format("mm")} ${moment(
                        response?.created_at
                      ).format("a")}`}</h4>
                      <h3 style={{ textTransform: "capitalize" }}>
                        {`${response?.subject}`}
                      </h3>
                      <h6>{response?.message}</h6>
                    </Col>
                  </Row>
                );
              })}
              {page < state?.responses?.length && (
                <Text
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => {
                    setPage((val) => val + 5);
                  }}
                >
                  ..Readmore
                </Text>
              )}
              {page > state?.responses?.length && page > 5 && (
                <Text
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => {
                    setPage((val) => val - 5);
                  }}
                >
                  ..ReadLess
                </Text>
              )}
            </Col>
          </>
        )}
        <div>
          <br />
          <span style={{ fontWeight: "bold" }} className="mt-3 ">
            Respond:{" "}
          </span>
          <form
            onSubmit={handleSubmit}
            style={{
              marginLeft: "2rem",
              marginRight: "2rem",
              marginTop: "1rem",
            }}
          >
            <TextInput
              className="mt-3"
              label="Subject"
              id="subject"
              name="subject"
              placeholder="Enter Subject"
              {...form.getInputProps("subject")}
            />
            <Textarea
              className="mt-3"
              rows={4}
              label="Message"
              id="message"
              name="message"
              placeholder="Enter Message"
              {...form.getInputProps("message")}
            />
            <div className="d-flex flex-row justify-content-end mt-4">
              <Button
                type="submit"
                className="primary-btn mt-3"
                disabled={loaderOfButton}
              >
                {loaderOfButton && <Spinner />}
                Respond
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageViewForAdmin;
