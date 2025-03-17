import React from "react";
import { Col, Row } from "react-bootstrap";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Collapse, Tabs, Divider, Flex, Badge, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { attachTokenWithFormAxios, formAxios } from "../services/axiosConfig";
import { errorMessage, successMessage } from "../globalFunctions";
import { UseGetRole } from "../hooks/auth";

const AppointmentCase = ({ data, appointmentId = "#", fetchAppointments }) => {
  const role = UseGetRole();

  const formattedDate = dayjs(data?.created_at)
    .locale("en")
    .format("ddd D MMM YYYY");

  const [opened, { toggle, close }] = useDisclosure(false);

  const changeStatushandle = async (id, value) => {
    try {
      const formData = new FormData();
      formData.append("status", value);
      formData.append("appointment_id", id);
      attachTokenWithFormAxios();
      let response = await formAxios.post(
        `lawyer/appointments/update`,
        formData
      );
      if (response.data.res === "success") {
        successMessage("Status Update!");
        fetchAppointments();
      } else if (response?.data?.res === "error")
        errorMessage(response?.data?.message || "Server Error");
    } catch (err) {}
  };

  return (
    <>
      <Col
        xs={12}
        className="client py-md-3 py-2 px-md-4 px-sm-3 px-2 d-flex flex-wrap gap-md-3 gap-sm-2 gap-1 align-items-center justify-content-between position-relative"
      >
        <Flex align={"center"} gap={50} w={"100%"}>
          <Flex align={"center"} gap={25} w={"100%"}>
            <Flex direction={"column"} w={"100%"}>
              <Flex justify={"space-between"} gap={25} wrap={"wrap"} w={"100%"}>
                <span className="client-name appointment-number font-poppins cursor-pointer ml-1 text-capitalize">
                  {data?.title}
                </span>
                <Badge
                  size="lg"
                  color={
                    data?.status === 0
                      ? "gray"
                      : data?.status === 1
                      ? "green"
                      : data?.status === 2
                      ? "red"
                      : "orange"
                  }
                >
                  {data?.status_text}
                </Badge>
              </Flex>
              <Link
                onClick={toggle}
                className="case-description-btn in-appoint"
              >
                Appointment description
                <i className="fa fa-chevron-right"></i>
              </Link>
            </Flex>
          </Flex>
        </Flex>
        {role === "Lawyer" && (
          <div className="d-flex flex-column align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="status-width-in-appoint d-flex flex-column align-items-end justify-content-end gap-sm-2">
                <Select
                  name="lawyer_id"
                  id="lawyer_id"
                  label={
                    <span className="font-poppins grey-label grey-label-in-appointment">
                      Appointment Status
                    </span>
                  }
                  placeholder="Select lawyer"
                  data={[
                    { label: "Pending", value: 0, disabled: true },
                    {
                      label: data?.status === 1 ? "Confirmed" : "Confirm",
                      value: 1,
                    },
                    {
                      label: data?.status === 2 ? "Cancelled" : "Cancel",
                      value: 2,
                    },
                  ]}
                  defaultValue={data?.status}
                  onChange={(value) => changeStatushandle(data?.id, value)}
                />
              </div>
            </div>
          </div>
        )}
      </Col>
      <Collapse
        in={
          data?.id === parseInt(appointmentId?.toString()?.slice(1)) || opened
        }
        className="my-md-4 my-sm-3 my-1 case-details-container"
      >
        <div className="case-details-header border-bottom pt-3 px-3 pb-1">
          <Row className="justify-content-between pb-3">
            <Col xs={2} className="d-flex justify-content-start">
              <i
                className="fa fa-chevron-up cursor-pointer"
                onClick={close}
              ></i>
            </Col>
          </Row>

          <Tabs
            color="orange"
            variant="pills"
            radius="xl"
            // orientation={!smallScreen ? "vertical" : "horizontal"}
            defaultValue="appointment"
            className="mt-1"
          >
            <div className="d-flex justify-content-between">
              <Tabs.List className="mb-2">
                <Tabs.Tab value="appointment">
                  <span className="">Description</span>
                </Tabs.Tab>
              </Tabs.List>
              <div className="d-flex align-items-center flex-wrap  w-sm-25 text-end ">
                {data?.created_at ? (
                  <>
                    <span className="text-dark  case-date">
                      {formattedDate}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
            <Divider />

            <Tabs.Panel value="appointment" pl="xs" pt="lg" className="mb-3">
              {data?.description}
              <br />
              <br />
              <p className="appointment-detail">
                <strong>Appointment Date: </strong>
                <span>{data?.appointment_date}</span>
              </p>
              {/* <br /> */}
              <p className="appointment-detail">
                <strong>Appointment Start Time: </strong>
                <span>{data?.appointment_start_time}</span>
              </p>
              {/* <br /> */}
              <p className="appointment-detail">
                <strong>Appointment End Time: </strong>
                <span>{data?.appointment_end_time}</span>
              </p>
            </Tabs.Panel>
          </Tabs>
        </div>
      </Collapse>
    </>
  );
};

export default AppointmentCase;
