import React, { useState } from "react";
import { Col, Dropdown, Row } from "react-bootstrap";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import {
  Collapse,
  Tabs,
  Divider,
  Avatar,
  Select,
  Badge,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UseGetRole } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import { attachTokenWithFormAxios, formAxios } from "../services/axiosConfig";
import { successMessage } from "../globalFunctions";
import "dayjs/locale/en";
import { IconChevronDown } from "@tabler/icons-react";

const ClientCase = ({ data, caseId = '#', fetchCases }) => {
  const navigate = useNavigate();
  const role = UseGetRole();
  const formattedDate = dayjs(data?.created_at)
    .locale("en")
    .format("ddd D MMM YYYY");

  const [opened, { toggle, close }] = useDisclosure(false);

  const handleLawyerProfile = () => {
    navigate("/lawyer-profile", { state: data?.lawyer?.id });
  };

  const handleNavigateChat = () => {
    let userData = null;
    if (role === "Lawyer") {
      userData = data.client;
    } else {
      userData = data.lawyer;
    }

    navigate(`/chat/${userData?.id}`, {
      state: { lawyer_id: data?.lawyer?.id, userData: userData },
    });
  };

  const changeStatushandle = async (id, value) => {
    try {
      const formData = new FormData();
      formData.append("status", value);
      attachTokenWithFormAxios();
      let response = await formAxios.post(
        `lawyer/cases/update/${id}`,
        formData
      );
      if (response.data.res === "success") {
        fetchCases();
        successMessage("Status Update!");
      }
    } catch (err) { }
  };

  return (
    <>
      <Col
        xs={12}
        className="client parent-div-of-case py-3 px-md-4 px-2 d-flex flex-row flex-wrap gap-sm-3 gap-1 align-items-center justify-content-between position-relative"
      >
        <div
          className={`d-flex gap-5 align-items-center --sadas-- ${role === "Lawyer" && "div-of-case"
            }`}
        >
          <div className="d-flex gap-sm-3 gap-1 align-items-center">
            <Avatar
              src={
                role === "Lawyer"
                  ? data?.client?.profile
                  : data?.lawyer?.profile
              }
              alt="user-profile-pic"
              radius={100}
              size={80}
            />

            <span className="d-flex flex-column">
              {role === "Lawyer" ? (
                <span className="client-name font-poppins text-capitalize">
                  {data?.client?.first_name + " " + data?.client?.last_name}
                </span>
              ) : role === "Client" ? (
                <span
                  className="client-name font-poppins cursor-pointer text-capitalize"
                  onClick={handleLawyerProfile}
                >
                  {data?.lawyer?.first_name + " " + data?.lawyer?.last_name}
                </span>
              ) : null}
              <Link onClick={toggle} className="case-description-btn">
                Case description
                <i className="fa fa-chevron-right"></i>
              </Link>
            </span>
          </div>
        </div>
        <div
          className={`d-flex flex-column ${role === "Lawyer" && "align-items-end div-of-case"
            }`}
        >
          {role === "Client" ? (
            <Flex align={"center"} justify={"end"} gap={12}>
              <button
                className="primary-btn btn-of-datatable text-capitalize"
                onClick={handleNavigateChat}
              >
                chat
              </button>
              <Badge
                color={
                  data?.case?.status === 0
                    ? "yellow"
                    : data?.case?.status === 1
                      ? "teal"
                      : data?.case?.status === 2
                        ? "red"
                        : data?.case?.status === 3
                          ? "green"
                          : "orange"
                }
              >
                {data?.status_text}
              </Badge>
            </Flex>
          ) : (
            <div className="d-flex align-items-center gap-sm-3 gap-1">
              <button
                className="primary-btn btn-of-datatable  w-100 mt-4 text-capitalize"
                onClick={handleNavigateChat}
              >
                chat
              </button>
              <div className="status-div-of-lawyer-cases-in-case d-flex flex-column align-items-center justify-content-center">
                <span className="font-poppins grey-label grey-label-in-appointment">
                  Case Status
                </span>
                <Select
                  onChange={(value) =>
                    changeStatushandle(data?.case?.id, value)
                  }
                  placeholder="Pick one"
                  rightSection={<IconChevronDown size="1rem" />}
                  rightSectionWidth={30}
                  value={data?.case?.status}
                  styles={{ rightSection: { pointerEvents: "none" } }}
                  data={[
                    { label: "Pending", value: 0 },
                    { label: "Approved", value: 1 },
                    { label: "Reject", value: 2 },
                    { label: "Completed", value: 3 },
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      </Col>

      <Collapse
        in={data?.case?.id === parseInt(caseId?.toString()?.slice(1)) || opened}
        className="my-4 case-details-container"
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
            defaultValue="case"
            className="mt-1"
          >
            <div className="d-flex justify-content-between">
              <Tabs.List
                sx={{
                  "[data-active]": {
                    backgroundColor: "#db9753 !important",
                    "&:hover": {
                      backgroundColor: "#c58749 !important",
                    },
                  },
                }}
                className="mb-2"
              >
                <Tabs.Tab value="case">Case</Tabs.Tab>
                <Tabs.Tab value="case-summary">Case Summary</Tabs.Tab>
              </Tabs.List>
              <div className="d-flex align-items-center flex-row gap-1">
                {data?.created_at ? (
                  <>
                    <span className="text-dark w-100  case-date">
                      {formattedDate}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
            <Divider />

            <Tabs.Panel
              value="case"
              pl="xs"
              pt="lg"
              className="mb-3"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {data?.case?.case}

              {data?.status === "Approved" && role === "Lawyer" && (
                <button
                  className="primary-btn text-capitalize"
                  onClick={() => {
                    navigate("/lawyer/contract/create", {
                      state: { id: data?.id },
                    });
                  }}
                  style={{ marginLeft: "auto" }}
                >
                  Create Contract
                </button>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="case-summary" pl="xs" pt="lg" className="mb-3">
              {data?.case_summary}
            </Tabs.Panel>
          </Tabs>
        </div>
      </Collapse >
    </>
  );
};

export default ClientCase;
