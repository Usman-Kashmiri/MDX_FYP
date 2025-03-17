import React from "react";
import ExpiredImg from "../../assets/images/meeting/icon/expired.png";

const MeetingExpired = ({
  expiredTime = "00-00-0000",
  StartTime = "00-00-0000",
}) => {
  return (
    <div className="meeting-expired">
      <img src={ExpiredImg} />
      <h2>Meeting Expired</h2>
      <div className="meetingTimeBox">
        <div className="meetingTimeBox-item">
          <span>Start Time</span>
          <p>{time_format(StartTime)}</p>
        </div>
        <div className="meetingTimeBox-item">
          <span>End Time</span>
          <p>{time_format(expiredTime)}</p>
        </div>
      </div>
    </div>
  );
};
function time_format(inputTimestamp) {
  // Convert the input timestamp to a JavaScript Date object
  const date = new Date(inputTimestamp);

  // Get the individual date and time components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1 and pad with '0'
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Create the formatted timestamp string
  return `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
}
export default MeetingExpired;
