import React, { useState, useEffect, useCallback } from "react";

function ReverseTimer({ expirationTime, setMeetingStatus }) {
  const calculateRemainingTime = useCallback(() => {
    const targetTimestamp = new Date(expirationTime).getTime();
    const currentTime = new Date().getTime();
    const remainingMilliseconds = Math.max(targetTimestamp - currentTime, 0);
    const remainingSeconds = Math.floor((remainingMilliseconds / 1000) % 60);
    const remainingMinutes = Math.floor(
      (remainingMilliseconds / (1000 * 60)) % 60
    );
    const remainingHours = Math.floor(
      (remainingMilliseconds / (1000 * 60 * 60)) % 24
    );
    const remainingDays = Math.floor(
      remainingMilliseconds / (1000 * 60 * 60 * 24)
    );
    return {
      days: remainingDays,
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds,
    };
  }, [expirationTime]);

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime, calculateRemainingTime]);

  useEffect(() => {
    if (remainingTime.minutes === 0) {
      setMeetingStatus("expired");
    }
  }, [remainingTime, setMeetingStatus]);

  return (
    <div className="reversetimermeeting">
      <h5 className="m-0">Time Remaining:</h5>
      <p className="m-0">
        {remainingTime.minutes}:{remainingTime.seconds}{" "}
      </p>
    </div>
  );
}

export default ReverseTimer;
