import React, { useEffect, useCallback, useRef } from "react";
import logo from "../../assets/images/Logo.svg";
import ReverseTimer from "./reverseTimer";

const JitsiMeeting = ({ data, setMeetingStatus }) => {
  const apiRef = useRef(null);

  const startMeet = useCallback(() => {
    const domain = "8x8.vc";
    const user = JSON.parse(localStorage.getItem("user"));
    const id = data.id;

    const options = {
      roomName: id,
      width: "100%",
      height: "100%",
      DEFAULT_REMOTE_DISPLAY_NAME: `${user?.first_name} ${user?.last_name}`,
      userInfo: {
        displayName: `${user?.first_name} ${user?.last_name}`,
        email: user?.email,
        avatarURL: user?.image,
      },
      configOverwrite: {
        authentication: "anonymous",
        startWithAudioMuted: true,
        startWithVideoMuted:
          data.meeting_type === "audio_meeting" ? true : false,
        disableModeratorIndicator: true,
        startScreenSharing: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        toolbarButtons: [
          "microphone",
          "camera",
          "closedcaptions",
          "desktop",
          "fullscreen",
          "sharescreen",
          "fodeviceselection",
          "hangup",
          "profile",
          "recording",
          "settings",
          "raisehand",
          "videoquality",
          "filmstrip",
          "tileview",
          "videobackgroundblur",
          "participants",
          "download",
          "mute-everyone",
          "e2ee",
        ],
      },
      interfaceConfig: {
        SHOW_BRAND_WATERMARK: false,
        APP_NAME: "Nbundl",
      },
      localRecording: {
        enabled: false,
        format: "flac",
      },
      parentNode: document.querySelector("#jitsi-iframe"),
    };

    if (window.JitsiMeetExternalAPI) {
      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      apiRef.current.addEventListeners({
        videoConferenceJoined: function () {
          apiRef.current.executeCommand("avatarUrl", user?.image);
          const localParticipant = apiRef.current.getParticipantsInfo()[0];
          if (
            localParticipant?.email === user?.email &&
            user?.role === "Lawyer"
          ) {
            apiRef.current.executeCommand("overwriteConfig", {
              toolbarButtons: [
                "microphone",
                "camera",
                "closedcaptions",
                "desktop",
                "fullscreen",
                "fodeviceselection",
                "hangup",
                "profile",
                "recording",
                "settings",
                "raisehand",
                "videoquality",
                "filmstrip",
                "tileview",
                "videobackgroundblur",
                "participants",
                "e2ee",
                "invite",
                "livestreaming",
                "mute-everyone",
                "__end",
                "kick-out",
                "mute-video-everyone",
                "participants-pane",
              ],
            });
          } else {
            apiRef.current.executeCommand("overwriteConfig", {
              toolbarButtons: ["microphone", "camera", "fullscreen", "hangup"],
            });
          }
        },
      });
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    startMeet();
  }, [startMeet]);

  return (
    <React.Fragment>
      <div className="meeting-box-main">
        <header className="meetingHeader">
          <p style={{ margin: 0, padding: 10 }}>{data.room_name}</p>
          <ReverseTimer
            setMeetingStatus={setMeetingStatus}
            expirationTime={data.expire_time}
          />
        </header>
        <div className="brandLogo">
          <img src={logo} className="" alt="nbundl - logo" />
        </div>
        <div id="jitsi-iframe" style={{ marginBottom: 0 }}></div>
      </div>
    </React.Fragment>
  );
};

export default JitsiMeeting;
