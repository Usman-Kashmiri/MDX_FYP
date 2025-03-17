import React, { useEffect, useState } from "react";
import { Container, Spinner, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addLawyerAvailibilityTime,
  getLawyerAvailibilityTime,
} from "../redux/actions/lawyerAction";
import { Button, Table } from "@mantine/core";

const AvailabilityLawyer = () => {
  const dispatch = useDispatch();
  const { lawyerAvailableTime, loading } = useSelector(
    (state) => state?.lawyer
  );
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);

  useEffect(() => {
    dispatch(getLawyerAvailibilityTime());
  }, [dispatch]);

  const [currentDay, setCurrentDay] = useState("");

  const handleCheckboxClick = (value, index) => {
    setCurrentDay(index);
    if (selectedDays.includes(value)) {
      setSelectedDays(selectedDays.filter((day) => day !== value));
      setStartTimes(
        startTimes.filter((_, index) => selectedDays[index] !== value)
      );
      setEndTimes(endTimes.filter((_, index) => selectedDays[index] !== value));
    } else {
      const newDays = [...selectedDays];
      newDays[index] = value;
      setSelectedDays(newDays);
      setStartTimes([...startTimes, ""]);
      setEndTimes([...endTimes, ""]);
    }
  };

  const filteredLawyerAvailableTime = lawyerAvailableTime.filter(
    (item) => item.day && item.start_time && item.end_time
  );

  useEffect(() => {
    if (filteredLawyerAvailableTime) {
      const selectedDaysFromData = days.map((value, index) => {
        return filteredLawyerAvailableTime.find((item) => item.day === value)
          ?.day;
      });
      setSelectedDays(selectedDaysFromData);
      const selectedDaysFromData2 = days.map((value, index) => {
        return filteredLawyerAvailableTime.find((item) => item.day === value)
          ?.start_time;
      });
      setStartTimes(selectedDaysFromData2);
      const selectedDaysFromData3 = days.map((value, index) => {
        return filteredLawyerAvailableTime.find((item) => item.day === value)
          ?.end_time;
      });
      setEndTimes(selectedDaysFromData3);
    }
  }, [lawyerAvailableTime]);

  const rows = days.map((value, index) => {
    const initialData = filteredLawyerAvailableTime.find(
      (item) => item.day === value
    );
    const isDaySelected = selectedDays.includes(value);

    return (
      <tr key={index}>
        <td>
          <input
            onChange={() => handleCheckboxClick(value, index)}
            checked={isDaySelected}
            type="checkbox"
            id={`checkbox-${index}`}
            name={`checkbox-${index}`}
          />
        </td>
        <td>{value}</td>
        <td>
          <input
            type="time"
            onChange={(e) => {
              const newStartTimes = [...startTimes];
              newStartTimes[index] = `${e.target.value}:00`;
              setStartTimes(newStartTimes);
            }}
            value={
              (isDaySelected && startTimes[index]) ||
              (initialData && initialData.start_time) ||
              ""
            }
            className="w-75 p-2 timeInput"
          />
        </td>
        <td>
          <input
            type="time"
            onChange={(e) => {
              const newEndTimes = [...endTimes];
              newEndTimes[index] = `${e.target.value}:00`;
              setEndTimes(newEndTimes);
            }}
            value={
              (isDaySelected && endTimes[index]) ||
              (initialData && initialData.end_time) ||
              ""
            }
            className="w-75 p-2 timeInput"
          />
        </td>
      </tr>
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const mergedDataArray = selectedDays?.map((value, index) => {
      return {
        day: value,
        start_time: startTimes[index],
        end_time: endTimes[index],
      };
    });

    const filteredArray = mergedDataArray.filter(
      (event) => event.day && event.start_time && event.end_time
    );
    dispatch(addLawyerAvailibilityTime(filteredArray));
  };

  return (
    <Container fluid>
      <div>
        <Form onSubmit={handleSubmit}>
          <div className="lawyer-availability-table">
            <Table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Days</th>
                  <th>Start time</th>
                  <th>End time</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              loading={loading}
              className="signinbtn availibility-btn mt-3"
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default AvailabilityLawyer;
