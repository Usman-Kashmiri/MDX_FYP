import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { getUserData } from "../../hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { FaMicrophone, FaMicrophoneAltSlash } from "react-icons/fa";
import { FiCamera, FiCameraOff } from "react-icons/fi";
import { Avatar, Button } from "@mantine/core";
import { ImPhoneHangUp } from "react-icons/im";
import { meetingCheck, meetingEnd } from "../../redux/actions/meetingAction";
import { warningMessage } from "../../globalFunctions";

const PRE = "NBUNDL_";
const SUF = "_MEET";

const RtcMeeting = ({ id, meeting_type = "video_meeting" }) => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [roomData, setRoomData] = useState();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [RemoteVideoON, setRemoteVideoOn] = useState(true);
  const [localStream, setLocalStream] = useState();
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const user = getUserData();
  const { socket } = useSelector((state) => state?.web);
  const { loading } = useSelector((state) => state?.meeting);
  const [opponentData, setOpponentData] = useState();

  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  const room_id = PRE + id + SUF;
  let localVideo = null;

  const call = (remotePeerId) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setLocalStream(mediaStream);
        localVideo = document.getElementById("local-video");
        localVideo.srcObject = mediaStream;
        localVideo.muted = true;

        localVideo.onloadedmetadata = function (e) {
          localVideo.play();
        };

        const call = peerInstance.current.call(remotePeerId, mediaStream);
        call.on("stream", (remoteStream) => {
          let video = document.getElementById("remote-video");
          video.srcObject = remoteStream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        });
      })
      .catch((err) => {
        console.error("Error accessing media devices: ", err);
      });
  };

  const handleResponseJoinRoom = async (room) => {
    setRoomData(room);
    room?.participants.map((parti) => {
      if (parti.userId != user.id) {
        console.log("part ", parti);
        call(parti.peerId);
        setRemotePeerIdValue(parti.peerId);
        setOpponentData(parti);
      }
    });
  };

  socket.on("responseJoinRoom", handleResponseJoinRoom);

  socket.on("sendChatToClient", (message) => {
    try {
      const { content, senderID } = message;
      if (content == "cameraOn") {
        if (senderID != user.id) {
          setRemoteVideoOn(true);
        }
      } else if (content == "cameraOff") {
        if (senderID != user.id) {
          setRemoteVideoOn(false);
        }
      } else if (content == "end_meeting") {
        if (senderID != user.id) {
          warningMessage("Your opponent has ended the meeting");
          dispatch(meetingCheck(id));
        }
      } else {
      }
    } catch (error) {
      console.error("connection error: ", error);
    }
  });

  useEffect(() => {
    const peer = new Peer(socket.id);
    peer.on("open", (id) => {
      console.log("peer id ", id);
      setPeerId(id);
    });
    peer.on("call", (call) => {
      try {
        console.log("call ", call);
        var getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;
        getUserMedia({ video: true, audio: true }, (mediaStream) => {
          setLocalStream(mediaStream);
          localVideo = document.getElementById("local-video");
          localVideo.srcObject = mediaStream;
          localVideo.muted = true;

          localVideo.onloadedmetadata = function (e) {
            localVideo.play();
          };
          call.answer(mediaStream);
          call.on("stream", function (remoteStream) {
            let video = document.getElementById("remote-video");
            video.srcObject = remoteStream;

            video.onloadedmetadata = function (e) {
              video.play();
            };
          });
        });
      } catch (err) {
        console.error("Error accessing media devices: ", err);
      }
    });

    peerInstance.current = peer;
    return () => {
      // Cleanup function
      peer.disconnect(); // Disconnect from the Peer server
      peer.destroy(); // Clean up Peer instance

      // Close the local media stream if it exists
      if (localStream) {
        console.log("exit;");
        localStream.getTracks().forEach((track) => track.stop());
        if (currentUserVideoRef && currentUserVideoRef.current) {
          currentUserVideoRef = null;
        }

        remoteVideoRef = null;
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket && peerId) {
      socket.emit("connect_with_room", { room_id, user, peerId });
    }
  }, [socket, peerId]);

  const sendMessage = (defaultMessage = null) => {
    if (defaultMessage) {
      socket.emit("sendChatToServer", {
        message: defaultMessage,
        roomID: room_id,
        sender: user.id,
      });
    }
  };

  const toggleMic = async () => {
    try {
      let micUpdate = !isMicOn;
      if (localStream) {
        const audioTracks = localStream.getAudioTracks();

        setIsMicOn(micUpdate);
        audioTracks[0].enabled = micUpdate;
        sendMessage(micUpdate ? "micOn" : "micOff");
      }
    } catch (error) {
      console.error("Error toggling mic:", error);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      const newCamOn = !isCameraOn;
      setIsCameraOn(newCamOn);
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = newCamOn;
        sendMessage(newCamOn ? "cameraOn" : "cameraOff");
      }
    }
  };
  const dispatch = useDispatch();

  const handleMeetingEnd = async () => {
    try {
      let response = await dispatch(meetingEnd(id));
      if (response?.res == "success") {
        sendMessage("end_meeting");
        dispatch(meetingCheck(id));
      }
    } catch (error) {}
  };
  return (
    <div className="Dotclick-camkit">
      <div className="camkit-videos-list">
        <div className="local-box videobox">
          <video
            id="local-video"
            style={{ display: isCameraOn ? "block" : "none" }}
            ref={currentUserVideoRef}
            autoPlay
            playsInline
          />
          {!isCameraOn && (
            <div>
              <Avatar color="cyan" size={"lg"} radius="xl">
                {user?.first_name[0] + user?.last_name[0]}
              </Avatar>
            </div>
          )}
        </div>
        <div className="oppnent-box videobox">
          <video
            id="remote-video"
            style={{ display: RemoteVideoON ? "block" : "none" }}
            ref={remoteVideoRef}
            autoPlay
            playsInline
          />
          {!RemoteVideoON && (
            <div>
              <Avatar color="cyan" size={"lg"} radius="xl">
                {opponentData?.first_name[0] + opponentData?.last_name[0]}
              </Avatar>
            </div>
          )}
        </div>
      </div>
      <div className="meetingActions">
        <button id="btnCustomMic" onClick={toggleMic}>
          {isMicOn ? <FaMicrophone /> : <FaMicrophoneAltSlash />}
        </button>
        <button id="btnCustomCamera" onClick={toggleCamera}>
          {isCameraOn ? <FiCamera /> : <FiCameraOff />}
        </button>
        <Button
          loading={loading}
          color={"#b61a1a"}
          id="btnMeetingEnd"
          onClick={handleMeetingEnd}
        >
          <ImPhoneHangUp />
        </Button>
      </div>
    </div>
  );
};

export default RtcMeeting;
