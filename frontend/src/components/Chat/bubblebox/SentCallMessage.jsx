import { Button } from "@mantine/core";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { MdMissedVideoCall, MdPhoneMissed } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SentCallMessage = ({ type, meeting_id = 0, meeting_details = {} }) => {
  const navigate = useNavigate();
  const [meetingStatus, setMeetingStatus] = useState(true); // false = 'end', true = 'pending'

  useEffect(() => {
    if (meeting_details?.meeting_status !== "end") {
      const timestamp = meeting_details?.created_at;
      const currentTimestamp = moment();

      // Parse the timestamp into a moment instance
      const momentTimestamp = moment(timestamp);

      // Add one hour to the timestamp
      const timestampOneHourLater = momentTimestamp.add(1, "hour");
      if (currentTimestamp >= timestampOneHourLater) {
        setMeetingStatus(false);
      }
    } else {
      setMeetingStatus(false);
    }
  }, [meeting_details]);
  return (
    <div className="meeting-bubble">
      <div className="message">
        {`You have initiated a request for ${
          type === "video" ? "video" : "audio"
        } meeting.`}
      </div>
      <div className="meeting-actions">
        <Button
          disabled={!meetingStatus}
          sx={{
            width: "100%",
            minHeight: "40px",
            span: {
              display: "flex",
              justifyContent: "center",
              gap: "3px",
              svg: {
                width: "28px",
                height: "28px",
              },
            },
          }}
          className="primary-btn"
          onClick={() => {
            navigate(`/dashboard/video-meeting/${meeting_id}`);
          }}
        >
          {type === "video" ? <MdMissedVideoCall /> : <MdPhoneMissed />}{" "}
          {!meetingStatus ? "Meeting ended" : "Join"}
        </Button>
      </div>
    </div>
  );
};

export default SentCallMessage;
