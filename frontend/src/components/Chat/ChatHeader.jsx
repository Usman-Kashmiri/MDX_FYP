import React, { useEffect, useState } from "react";
import { Avatar, Skeleton, Tooltip } from "@mantine/core";
import { Fade } from "react-reveal";
import { trimString } from "../../helpers/helpers";
import { useMediaQuery } from "@mantine/hooks";

const ChatBoxHeader = ({ isOpenAnyOne, chatUser, setCallRequest }) => {
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const isTablet = useMediaQuery('(max-width: 767px)');
  useEffect(() => {
    // Function to update the isMediumScreen state based on window.innerWidth
    const updateIsMediumScreen = () => {
      setIsMediumScreen(window.innerWidth <= 992);
    };

    updateIsMediumScreen();

    window.addEventListener("resize", updateIsMediumScreen);
    return () => {
      window.removeEventListener("resize", updateIsMediumScreen);
    };
  }, []);

  return (
    <div className="position-relative w-100">
      <div className="chat-header">
        <span className="name-image-in-chat-header">
          {isMediumScreen && (
            <span
              onClick={() => {
                {
                  if (window.innerWidth <= 992) {
                    isOpenAnyOne(true, true);
                  }
                }
              }}
            >
              <button className="back-btn rounded-2">
                <i className="fa fa-chevron-left text-grey"></i>
              </button>
            </span>
          )}
          <span
            className="cursor-pointer"
            onClick={() => {
              chatUser && isOpenAnyOne(false, true, chatUser?.id);
            }}
          >
            {chatUser ? (

              <Avatar
                src={chatUser?.image}
                alt="user"
                radius={"xl"}
                size={"lg"}
              />
            ) : (
              <>

                <Skeleton height={isTablet ? 40 : 50} circle />
              </>
            )}
          </span>
          <span>
            {chatUser ? (
              <Tooltip
                color="#d5aa6d"
                withArrow
                label={`${chatUser?.first_name} ${chatUser?.last_name}`}
                position="bottom"
                display={
                  trimString(`${chatUser?.first_name} ${chatUser?.last_name}`)
                    .length > 15
                    ? "flex"
                    : "none"
                }
              >

                <p onClick={() => { isOpenAnyOne(false, true, chatUser?.id) }}
                  className="cursor-pointer name-of-chat-user text-capitalize">

                  {trimString(`${chatUser?.first_name} ${chatUser?.last_name}`)}
                </p>
              </Tooltip>
            ) : (
              <div className="name-of-chat-user">
                <Skeleton height={!isTablet ? 30 : 20} width={!isTablet ? 200 : 100} radius="sm" />
              </div>
            )}
            <Fade bottom>
              <p
                className=""
                style={{
                  color: "#007a67",
                  marginBottom: "0",
                  cursor: "default",
                }}
              >
                {Number(chatUser?.is_online) === 1 && "online"}{" "}
              </p>
            </Fade>
          </span>
        </span>
        <span className="name-of-header-in-chat">
          <Tooltip label="Start a voice meeting" position="bottom" offset={5}>
            <span
              className="cursor-pointer start-meeting-icons"
              onClick={() => {
                setCallRequest({
                  message_type: "audio_meeting",
                  isClickable: true,
                });
              }}
            >
              <i className="fa fa-phone"></i>
            </span>
          </Tooltip>
          <Tooltip label="Start a video meeting" position="bottom" offset={5}>
            <span
              className="cursor-pointer start-meeting-icons"
              onClick={() => {
                setCallRequest({
                  message_type: "video_meeting",
                  isClickable: true,
                });
              }}
            >
              <i className="fa fa-video-camera"></i>
            </span>
          </Tooltip>
        </span>
      </div>
    </div>
  );
};

export default ChatBoxHeader;
