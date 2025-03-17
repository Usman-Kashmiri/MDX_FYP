import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { meetingCheck } from "../redux/actions/meetingAction";
import MeetingExpired from "../components/Meeting/meetingExpired"; 
import UnAuthMeeting from "../components/Meeting/unauthMeeting";
import RtcMeeting from "../components/Meeting/RtcMeeting";
const VideoMeeting = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { checkMeeting } = useSelector((state) => state?.meeting);
  const [meetingStatus, setMeetingStatus] = useState("");

  useEffect(() => {
    dispatch(meetingCheck(id));
  }, [dispatch, id]);

  useEffect(() => {
    setMeetingStatus(checkMeeting.type);
  }, [checkMeeting]);

  return (
    <div className="main-meeting">
      {meetingStatus === "success" ? (
        <div className="unbundle-meeting"> 
          <RtcMeeting id={id} />
        </div>
      ) : meetingStatus === "expired" ? (
        <MeetingExpired
          StartTime={checkMeeting.data.start_time}
          expiredTime={checkMeeting.data.expire_time}
        />
      ) : meetingStatus === "unauthorized" ? (
        <UnAuthMeeting />
      ) : (
        <div className="">
          <i className="fa fa-solid fa-2x fa-spinner fa-spin"></i>
        </div>
      )}
    </div>
  );
};

export default VideoMeeting;
