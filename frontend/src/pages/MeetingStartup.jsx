import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Peer from "peerjs";
import { getUserData } from "../hooks/auth";
import { useSelector } from "react-redux";
import { FaMicrophone, FaMicrophoneAltSlash } from "react-icons/fa";
import { FiCamera, FiCameraOff } from "react-icons/fi";
import { Avatar } from "@mantine/core";

const PRE = "MINDFUL_";
const SUF = "_MEET";

const MeetingStartup = () => {
  const { id } = useParams();
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [roomData, setRoomData] = useState();
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [RemoteVideoON, setRemoteVideoOn] = useState(true);
  const [localStream, setLocalStream] = useState();
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const user = getUserData();
  const { socket } = useSelector((state) => state?.web);
  const [opponentData, setOpponentData] = useState();

  const room_id = PRE + id + SUF;
  let localVideo = null;
  const handleResponseJoinRoom = async (room) => {
    setRoomData(room);
    room?.participants.map((parti) => {
      if (parti.userId != user.id) {
        call(parti.peerId);
        setRemotePeerIdValue(parti.peerId);
        setOpponentData(parti);
        console.log(parti);
      }
    });
  };

  socket.on("responseJoinRoom", handleResponseJoinRoom);

  useEffect(() => {
    if (socket) {
      socket.emit("connect_with_room", { room_id, user, peerId });

      console.log("Connected to socket ", socket);
    }
  }, [socket, peerId]);

  socket.on("sendChatToClient", (message) => {
    const { content, senderID } = message;
    console.log("message ", message);
    if (content == "cameraOn") {
      if (senderID != user.id) {
        setRemoteVideoOn(true);
        // $('#remote-video').show();
      }
    } else if (content == "cameraOff") {
      if (senderID != user.id) {
        setRemoteVideoOn(false);
        // $('#remote-video').hide();
      }
    } else {
    }
  });
  useEffect(() => {
    const peer = new Peer(socket.id);
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      try {
        var getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;
        getUserMedia({ video: true, audio: true }, (mediaStream) => {
          setLocalStream(mediaStream);
          localVideo = document.getElementById("local-video");
          localVideo.srcObject = mediaStream;
          localVideo.muted = isMicOn;

          localVideo.onloadedmetadata = function (e) {
            localVideo.play();
          };
          call.answer(mediaStream);
          call.on("stream", function (remoteStream) {
            console.log("remoteStream", remoteStream);
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
  }, []);

  const call = (remotePeerId) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mediaStream) => {
        setLocalStream(mediaStream);
        localVideo = document.getElementById("local-video");
        localVideo.srcObject = mediaStream;
        localVideo.muted = false;

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
  const sendMessage = (defaultMessage = null) => {
    if (defaultMessage) {
      socket.emit("sendChatToServer", {
        message: defaultMessage,
        roomID: room_id,
        sender: user.id,
      });
    }
  };

  const toggleMic = () => {
    try {
      let micUpdate = !isMicOn;
      if (micUpdate) {
        if (localStream) {
          const audioTracks = localStream.getAudioTracks();
          setIsMicOn(!isMicOn);
          if (audioTracks.length > 0) {
            audioTracks[0].enabled = !isMicOn;
          }

          sendMessage("micOn");
        }
      } else {
        sendMessage("micOff");
      }
    } catch (error) {}
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      setIsCameraOn(!isCameraOn);
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !isCameraOn;
        sendMessage(isCameraOn ? "cameraOn" : "cameraOff");
      }
    }
  };
  useEffect(() => {
    console.log("remoteVideoRef ", remoteVideoRef);
  }, [remoteVideoRef]);

  return (
    <div className="Dotclick-camkit">
      <div className="camkit-videos-list">
        <div className="local-box videobox">
          <video id="local-video" ref={currentUserVideoRef} autoPlay />
        </div>
        <div className="oppnent-box videobox">
          <video
            id="remote-video"
            style={{ display: RemoteVideoON ? "block" : "none" }}
            ref={remoteVideoRef}
            autoPlay
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

      <button id="btnCustomMic" onClick={toggleMic}>
        {isMicOn ? <FaMicrophoneAltSlash /> : <FaMicrophone />}
      </button>
      <button id="btnCustomCamera" onClick={toggleCamera}>
        {isCameraOn ? <FiCameraOff /> : <FiCamera />}
      </button>
    </div>
  );
};

export default MeetingStartup;
