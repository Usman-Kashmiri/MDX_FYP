import React, { useEffect, useRef, useState } from "react";
import { DateInput } from "@mantine/dates";
import {
  Button,
  Flex,
  Input,
  Loader,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import Fade from "react-reveal/Fade";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientDashboardCases,
  getLawyerTimeSlot,
  bookAppointment,
  getLawyerAvailibility,
} from "../../redux/actions/clientActions";
import { useForm, yupResolver } from "@mantine/form";
import { AppointmentSchema } from "../../validations/ValidationSchema";
import { errorMessage, successMessage } from "../../globalFunctions";
import moment from "moment";
import dayjs from "dayjs";
import { DataTable } from "mantine-datatable";

const BookAppointment = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [islawyerSelected, setIsLawyerSelected] = useState(false);
  const [isDateSelected, setIsDayteSelected] = useState(false);
  const [dateOfAppointment, setDateOfAppointment] = useState();
  const [timeSlots, setTimeSlots] = useState([]);
  const [isTimeSlotsLoading, setTimeSlotsLoading] = useState(false);
  const [isAvailibiltyLoading, setAvailibiltyLoading] = useState(false);

  const state = useSelector((state) => state?.client);

  useEffect(() => {
    dispatch(getClientDashboardCases("approved", { page: 1, per_page: 100 }));
  }, []);

  useEffect(() => {
    if (state?.timeSlot) {
      setTimeSlots(
        state?.timeSlot?.map((item) => {
          return {
            label: `${item?.start_time} - ${item?.end_time}`,
            value: `${item?.start_time} - ${item?.end_time}`,
          };
        })
      );
    }
  }, [state?.timeSlot]);

  const { dashboard, loading } = useSelector((state) => state.client);

  const uniqueArray = dashboard?.reduce(
    (acc, value) => {
      const lawyerId = value.lawyer.id;
      if (!acc.some((item) => item.value === lawyerId)) {
        acc.push({
          value: lawyerId,
          label: value.lawyer.first_name + " " + value.lawyer.last_name,
        });
      }
      return acc;
    },
    [
      {
        label: "Select a Lawyer",
        value: "yo",
        disabled: true,
      },
    ]
  );

  const initialValues = {
    title: "",
    lawyer_id: "",
    description: "",
    appointment_date: "",
    appointment_start_time: "",
    appointment_end_time: "",
  };

  const validateInputOnChange = {
    title: "",
    lawyer_id: "",
    description: "",
    appointment_date: "",
    appointment_start_time: "",
    appointment_end_time: "",
  };

  const form = useForm({
    initialValues: initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: validateInputOnChange,
    validate: yupResolver(AppointmentSchema),
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.validate();

    if (!form.validate().hasErrors) {
      if (Object.keys(form.errors).length === 0) {
        const data = {
          ...form.values,
          client_id: JSON.parse(localStorage?.getItem("user")).id,
        };
        const res = await dispatch(bookAppointment(data));
        if (res?.res === "success") {
          setTimeSlots([]);
          successMessage("Appoinment submit successfully");
          setDateOfAppointment(null);
          setAppointmentTime("");
          setIsLawyerSelected("");
          setIsDayteSelected("");
          form.reset();
        }
      }
    }
  };

  const handleCalender = async (e) => {
    setTimeSlotsLoading(true);
    setDateOfAppointment(e);
    const date = moment(e, "ddd MMM DD YYYY HH:mm:ss ZZ");
    setIsDayteSelected(date.format("YYYY-MM-DD"));
    await form.setFieldValue("appointment_date", date.format("YYYY-MM-DD"));
    if (
      islawyerSelected &&
      !form?.errors?.appointment_date &&
      !form?.errors?.lawyer_id
    ) {
      try {
        const res = await dispatch(
          getLawyerTimeSlot({
            lawyer_id: islawyerSelected,
            appointment_date: date.format("YYYY-MM-DD"),
          })
        );

        setTimeSlotsLoading(false);

        if (res.res === "error" || res.data.length < 1) {
          errorMessage(
            "There are no time slots available for the selected date, Please selected any other date!"
          );
        }
      } catch (error) {
        setTimeSlotsLoading(false);
        console.error("An error occurred:", error);
      }
    }
  };

  const SelectLawyerHandle = async (value) => {
    form.setFieldValue("lawyer_id", value);
    setIsLawyerSelected(value);
    if (isDateSelected) {
      const res = await dispatch(
        getLawyerTimeSlot({
          lawyer_id: value,
          appointment_date: isDateSelected,
        })
      );
      if (res === "error") {
        errorMessage("There isn't any time slot available");
      }
    }
  };

  const [appointmentTime, setAppointmentTime] = useState("");

  const handleAppointment = async (value) => {
    const [startTime, endTime] = value.split(" - ");
    setAppointmentTime(value);
    form.setFieldValue("appointment_start_time", startTime);
    form.setFieldValue("appointment_end_time", endTime);
  };

  const fetchLawyers = async () => {
    setAvailibiltyLoading(true);
    try {
      if (form.values.lawyer_id !== "") {
        await dispatch(getLawyerAvailibility(form.values.lawyer_id));
        setAvailibiltyLoading(false);
      }
    } catch (error) {
      setAvailibiltyLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [form.values.lawyer_id]);

  return (
    <Fade>
      <div className="p-md-5 p-3  " style={{ minHeight: "110vh" }}>
        <h2>Appointment with Lawyer</h2>
        <form className=" mx-md-4 mx-sm-3 mx-2" onSubmit={handleFormSubmit}>
          <Row>
            <Col sm={6} className="mt-3">
              <Input.Wrapper id={1} label="Select Lawyer" required>
                <Select
                  name="lawyer_id"
                  id="lawyer_id"
                  placeholder="Select lawyer"
                  data={uniqueArray}
                  value={form.values.lawyer_id}
                  onChange={(value) => {
                    SelectLawyerHandle(value);
                  }}
                  onBlur={() => {
                    form.validateField("lawyer_id");
                  }}
                  error={form.errors.lawyer_id}
                />
              </Input.Wrapper>
            </Col>
            <Col sm={6} className="mt-3">
              <Input.Wrapper id={2} label="Subject">
                <TextInput
                  name="title"
                  id="title"
                  withAsterisk
                  placeholder="Enter subject"
                  {...form.getInputProps("title")}
                  error={form.errors.title}
                />
              </Input.Wrapper>
            </Col>
            <Col xs={12} className="mt-3">
              <Textarea
                name="description"
                id="description"
                minRows={6}
                maxRows={6}
                placeholder=" Enter Description"
                label="Description"
                withAsterisk
                {...form.getInputProps("description")}
              />
            </Col>
            <Col sm={6} className="mt-3">
              <DateInput
                ref={calendarRef}
                onChange={(e) => {
                  handleCalender(e);
                }}
                onBlur={() => {
                  form.validateField("appointment_date");
                }}
                error={form.errors.appointment_date}
                minDate={new Date()}
                maxDate={dayjs(new Date()).add(1, "month").toDate()}
                name="appointment_date"
                id="appointment_date"
                value={dateOfAppointment}
                withAsterisk
                label="Date input"
                placeholder="Date input"
                rightSection={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer"
                    onClick={() => calendarRef.current.focus()}
                  >
                    <path
                      d="M13.5524 1.67374H11.9874V0.891243C11.9874 0.683713 11.905 0.484682 11.7582 0.337936C11.6115 0.19119 11.4124 0.108749 11.2049 0.108749C10.9974 0.108749 10.7983 0.19119 10.6516 0.337936C10.5049 0.484682 10.4224 0.683713 10.4224 0.891243V1.67374H5.72745V0.891243C5.72745 0.683713 5.64501 0.484682 5.49827 0.337936C5.35152 0.19119 5.15249 0.108749 4.94496 0.108749C4.73743 0.108749 4.5384 0.19119 4.39165 0.337936C4.24491 0.484682 4.16247 0.683713 4.16247 0.891243V1.67374H2.59748C1.97489 1.67374 1.3778 1.92106 0.937561 2.3613C0.497323 2.80154 0.25 3.39863 0.25 4.02122V13.4111C0.25 14.0337 0.497323 14.6308 0.937561 15.0711C1.3778 15.5113 1.97489 15.7586 2.59748 15.7586H13.5524C14.175 15.7586 14.7721 15.5113 15.2123 15.0711C15.6525 14.6308 15.8999 14.0337 15.8999 13.4111V4.02122C15.8999 3.39863 15.6525 2.80154 15.2123 2.3613C14.7721 1.92106 14.175 1.67374 13.5524 1.67374ZM14.3349 13.4111C14.3349 13.6187 14.2524 13.8177 14.1057 13.9644C13.9589 14.1112 13.7599 14.1936 13.5524 14.1936H2.59748C2.38995 14.1936 2.19092 14.1112 2.04417 13.9644C1.89743 13.8177 1.81499 13.6187 1.81499 13.4111V7.93368H14.3349V13.4111ZM14.3349 6.3687H1.81499V4.02122C1.81499 3.81369 1.89743 3.61466 2.04417 3.46791C2.19092 3.32116 2.38995 3.23872 2.59748 3.23872H4.16247V4.02122C4.16247 4.22875 4.24491 4.42778 4.39165 4.57452C4.5384 4.72127 4.73743 4.80371 4.94496 4.80371C5.15249 4.80371 5.35152 4.72127 5.49827 4.57452C5.64501 4.42778 5.72745 4.22875 5.72745 4.02122V3.23872H10.4224V4.02122C10.4224 4.22875 10.5049 4.42778 10.6516 4.57452C10.7983 4.72127 10.9974 4.80371 11.2049 4.80371C11.4124 4.80371 11.6115 4.72127 11.7582 4.57452C11.905 4.42778 11.9874 4.22875 11.9874 4.02122V3.23872H13.5524C13.7599 3.23872 13.9589 3.32116 14.1057 3.46791C14.2524 3.61466 14.3349 3.81369 14.3349 4.02122V6.3687Z"
                      fill="#36CB83"
                    />
                  </svg>
                }
              />
            </Col>
            <Col sm={6} className="mt-3">
              <Input.Wrapper id={2} label="Time slot" required>
                <Flex align="center" gap={10}>
                  {isTimeSlotsLoading && <Loader size="sm" color="#db9753" />}
                  <Select
                    onChange={(e) => {
                      handleAppointment(e);
                    }}
                    value={appointmentTime}
                    name="appointment_start_time"
                    id="appointment_start_time"
                    placeholder="Select Time slot"
                    sx={{ flex: 1 }}
                    disabled={isTimeSlotsLoading}
                    data={timeSlots}
                    onBlur={() => {
                      form.validateField("appointment_start_time");
                    }}
                    error={form.errors.appointment_start_time}
                  />
                </Flex>
              </Input.Wrapper>
            </Col>

            <Col
              style={{
                marginTop: "3rem",
                display: "flex",
                justifyContent: "end",
                width: "100%",
              }}
            >
              <div className="d-flex justify-content-end">
                <Button
                  loading={loading}
                  disabled={loading}
                  className="signinbtn"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </form>

        <Flex direction="column" gap={15}>
          <Title order={3}>Lawyer's Availibility:</Title>
          <LawyersAvailibility loading={isAvailibiltyLoading} />
        </Flex>
      </div>
    </Fade>
  );
};

const LawyersAvailibility = ({ loading }) => {
  const { lawyerAvailibility } = useSelector((store) => store.client);
  const columns = [
    {
      accessor: "id",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "day",
      width: "auto",
      title: "Day",
    },
    {
      accessor: "start_time",
      width: "auto",
      title: "Start Time",
    },
    {
      accessor: "end_time",
      width: "auto",
      title: "End Time",
    },
  ];

  return (
    <DataTable
      className="data-table-with-actions"
      withBorder
      records={lawyerAvailibility}
      withColumnBorders
      striped
      highlightOnHover
      verticalSpacing={10}
      columns={columns}
      fetching={loading}
      minHeight={400}
      loaderVariant="dots"
      noRecordsText="No records found"
    />
  );
};

export default BookAppointment;
