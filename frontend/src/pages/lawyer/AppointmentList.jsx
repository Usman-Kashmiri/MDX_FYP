import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appointmentList } from "../../redux/actions/lawyerAction";
import { Col, Row } from "react-bootstrap";
import AppointmentCase from "../../components/AppointmentCase";
import { Loader, Pagination, SegmentedControl } from "@mantine/core";
import { appointmentListForClient } from "../../redux/actions/clientActions";
import { useLocation, useNavigate } from "react-router-dom";
import { DateInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import dayjs from "dayjs";

const AppointmentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointmentListRef = useRef();
  const id = location?.hash;
  const role = JSON.parse(localStorage.getItem("user")).role;
  const [selectedTab, setSelectedTab] = useState("all");
  const [date, setDate] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 5,
    total_records: 0,
  });

  const { appointmentsList } = useSelector((state) =>
    role === "Lawyer" ? state?.lawyer : role === "Client" && state?.client
  );

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let res;
      const formatedDate =
        date !== null ? dayjs(date).format("YYYY-MM-DD") : "";
      if (role === "Lawyer") {
        res = await dispatch(
          appointmentList(selectedTab, pagination, formatedDate)
        );
      } else if (role === "Client") {
        res = await dispatch(
          appointmentListForClient(selectedTab, pagination, formatedDate)
        );
      }
      setPagination({ ...pagination, total_records: res?.total_records || 0 });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [role, selectedTab, pagination.page, date]);

  useEffect(() => {
    if (location.hash !== "") {
      let id = location.hash.slice(1);
      const targetElement = document.getElementById(id);
      if (targetElement) {
        appointmentListRef.current.scrollTo({
          top: targetElement.offsetTop - 200,
          behavior: "smooth",
        });
      }
    }
  }, [appointmentsList]);
  return (
    <div className="pt-4 pb-3 px-sm-4 px-2">
      {role === "Client" && (
        <div>
          <div className="d-flex flex-row justify-content-between flex-wrap align-items-center mt-4">
            <h2 className="mb-2 heading-of-appointment ">Appointments</h2>
            <button
              className="mb-2 primary-btn text-capitalize create-blog-button"
              onClick={(e) => {
                navigate("/dashboard/book-appointment");
              }}
            >
              Book an Appointment
            </button>
          </div>
        </div>
      )}
      <Row className="mt-4 mx-auto w-100">
        <div className="clients-container">
          <Row className="py-3 px-md-4 px-2 clients-container-header">
            <Col sm={3} className="d-flex align-items-center">
              <span className="font-poppins  heading-of-appointment">
                Appointments
              </span>
            </Col>
            <Col
              sm={9}
              className="d-flex flex-wrap gap-3 align-items-center justify-content-end"
            >
              <DateInput
                icon={<IconCalendar />}
                clearable
                placeholder="Filter by Date"
                maw={300}
                value={date}
                onChange={setDate}
              />
              <SegmentedControl
                className="segment-of-appointment-table"
                value={selectedTab}
                defaultValue={"all"}
                onChange={setSelectedTab}
                data={[
                  { value: "all", label: "All" },
                  { value: "0", label: "Pending" },
                  { value: "1", label: "Confirmed" },
                  { value: "2", label: "Cancelled" },
                  { value: "3", label: "Past" },
                ]}
                color={"yellow"}
                bg={"white"}
              />
            </Col>
          </Row>
          <Row
            className="clients py-md-4 py-2 px-md-4 px-2 gap-3"
            ref={appointmentListRef}
          >
            {appointmentsList?.length > 0 ? (
              appointmentsList?.map((appointment, index) => {
                return (
                  <div key={index} id={appointment?.id}>
                    <AppointmentCase
                      appointmentId={id}
                      data={appointment}
                      fetchAppointments={fetchAppointments}
                    />
                  </div>
                );
              })
            ) : isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <Loader color="#db9651" size={"lg"} />
              </div>
            ) : (
              <div className="d-flex justify-content-center align-content-center mt-5">
                <p>You don't have any Appointments</p>
              </div>
            )}
          </Row>
          <div className="d-flex justify-content-end px-4 py-3">
            <Pagination
              value={pagination?.page}
              onChange={(page) => setPagination({ ...pagination, page })}
              total={Math.round(
                pagination?.total_records / pagination?.per_page
              )}
              position={"right"}
              radius="md"
            />
          </div>
        </div>
      </Row>
    </div>
  );
};

export default AppointmentList;
