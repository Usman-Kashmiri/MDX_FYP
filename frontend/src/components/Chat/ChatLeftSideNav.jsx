import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  offlineUser,
  onlineUser,
  peopleChatList,
} from "../../redux/actions/chatActions";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Avatar, Badge, Indicator, Tooltip } from "@mantine/core";
import autoAnimate from "@formkit/auto-animate";
import { trimString } from "../../helpers/helpers";

const ChatLeftSideNav = ({ isMediumScreen, isOpen, chatUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users: getUsers } = useSelector((state) => state?.chat);
  const { socket } = useSelector((state) => state?.web);
  const [users, setUsers] = useState([]);
  const chatListElememt = useRef(null);

  useEffect(() => {
    setUsers(getUsers);
  }, [getUsers]);
  useEffect(() => {
    dispatch(peopleChatList())
    socket.on("offlineUser", (data) => {
      if (getUsers) {
        dispatch(offlineUser(data, getUsers));
      }
    });

    socket.on("update-chat-list", (data) => {
      if (getUsers) {
        dispatch(onlineUser(data, getUsers));
      }
    });
  }, [dispatch]);

  const handleChangeOfSearch = (e) => {
    let value = e.target.value;
    let filterdata =
      value?.length > 2
        ? getUsers?.filter(
          (data) =>
            data?.first_name.toLowerCase().includes(value.toLowerCase()) ||
            data?.last_name.toLowerCase().includes(value.toLowerCase())
        )
        : getUsers;
    setUsers(filterdata);
  };

  useEffect(() => {
    chatListElememt.current &&
      autoAnimate(chatListElememt.current, {
        duration: 600,
        easing: "ease-out",
        disrespectUserMotionPreference: true,
      });
  }, [chatListElememt]);

  return (
    <div
      className={"pt-4 px-sm-2 d-flex flex-column align-items-start max-vh-100"}
    >
      <div className="d-flex pb-3 w-100">
        <div className="chat-searchbar d-flex align-items-center">
          <input
            type="search"
            name="search_message"
            id="search_message"
            className="w-100"
            placeholder="search message"
            onChange={handleChangeOfSearch}
          />
          <span className="px-3 search-icon">
            <i className="fa fa-search"></i>
          </span>
        </div>
      </div>
      <div className="chat-list ps-2 d-flex flex-column w-100">
        <span className="list-header d-flex justify-content-between w-100">
          <span>Recent Chats</span>
        </span>
        <div
          ref={chatListElememt}
          className="chat-list-box mt-2 pe-3 position-relative d-flex flex-column gap-2"
        >
          {users.length > 0
            ? users?.map((userRow, i) => (
              <div
                className="d-flex cursor-pointer gap-2 rounded-4"
                key={userRow?.id}
                onClick={() => {
                  chatUser?.id !== userRow?.id &&
                    navigate(`/chat/${userRow?.id}`);
                  isMediumScreen && isOpen(false);
                }}
              >
                <Indicator
                  inline
                  size={16}
                  offset={7}
                  position="bottom-end"
                  color={Number(userRow.is_online) ? "green" : "red"}
                  withBorder
                >
                  <Avatar
                    src={userRow?.image}
                    alt={userRow?.first_name + " " + userRow?.last_name}
                    size={"lg"}
                    radius={"xl"}
                    className="img-property"
                  />
                </Indicator>

                <div
                  className="d-flex flex-column gap-1 w-100 position-relative"
                  style={{
                    maxWidth: "100%",
                    overflowX: "hidden",
                  }}
                >
                  <div className="d-flex justify-content-between w-100">
                    <Tooltip
                      color="#d5aa6d"
                      withArrow
                      label={`${userRow?.first_name} ${userRow?.last_name}`}
                      position="right"
                      display={
                        trimString(
                          `${userRow?.first_name} ${userRow?.last_name}`
                        ).length > 15
                          ? "flex"
                          : "none"
                      }
                    >
                      <span className="font-montserrat fw-bold chat-name text-capitalize">
                        {trimString(
                          `${userRow?.first_name} ${userRow?.last_name}`
                        )}
                      </span>
                    </Tooltip>
                    <span className="date-text text-dark-grey font-poppins latest-timestamp">
                      {userRow?.latest_chat_data?.updated_at
                        ? dayjs(
                          `${userRow?.latest_chat_data?.updated_at}`
                        ).format("hh:mm a")
                        : "last Message"}
                    </span>
                  </div>
                  <span className="text-dark-grey font-poppins message-container-sdjkf latest-message">
                    {userRow?.latest_chat_data?.attach_type === "image" &&
                      userRow?.latest_chat_data?.message !== "" ? (
                      <>
                        <i
                          className="fa fa-camera"
                          style={{ marginRight: "5px" }}
                        ></i>
                        {userRow?.latest_chat_data?.message}
                      </>
                    ) : userRow?.latest_chat_data?.attach_type === "image" &&
                      userRow?.latest_chat_data?.message === "" ? (
                      <>
                        <i
                          className="fa fa-camera"
                          style={{ marginRight: "5px" }}
                        ></i>
                        Photo
                      </>
                    ) : userRow?.latest_chat_data?.attach_type === "video" &&
                      userRow?.latest_chat_data?.message !== "" ? (
                      <>
                        <i
                          className="fa fa-video"
                          style={{ marginRight: "5px" }}
                        ></i>
                        {userRow?.latest_chat_data?.message}
                      </>
                    ) : userRow?.latest_chat_data?.attach_type === "video" &&
                      userRow?.latest_chat_data?.message === "" ? (
                      <>
                        <i
                          className="fa fa-video"
                          style={{ marginRight: "5px" }}
                        ></i>
                        Video
                      </>
                    ) : (userRow?.latest_chat_data?.attach_type === "doc" ||
                      userRow?.latest_chat_data?.attach_type === "file") &&
                      userRow?.latest_chat_data?.message === "" ? (
                      <>
                        <i
                          className="fa fa-file"
                          style={{ marginRight: "5px" }}
                        ></i>
                        document
                      </>
                    ) : (userRow?.latest_chat_data?.attach_type === "doc" ||
                      userRow?.latest_chat_data?.attach_type === "file") &&
                      userRow?.latest_chat_data?.message !== "" ? (
                      <>
                        <i
                          className="fa fa-file"
                          style={{ marginRight: "5px" }}
                        ></i>
                        {userRow?.latest_chat_data?.message}
                      </>
                    ) : userRow?.latest_chat_data?.attach_type === "audio" &&
                      userRow?.latest_chat_data?.message === "" ? (
                      <>
                        <i
                          className="fa fa-headphones"
                          style={{ marginRight: "5px" }}
                        ></i>
                        audio
                      </>
                    ) : userRow?.latest_chat_data?.attach_type === "audio" &&
                      userRow?.latest_chat_data?.message !== "" ? (
                      <>
                        <i
                          className="fa fa-headphones"
                          style={{ marginRight: "5px" }}
                        ></i>
                        {userRow?.latest_chat_data?.message}
                      </>
                    ) : userRow?.latest_chat_data?.message_type ===
                      "audio_meeting" ? (
                      <>
                        <i
                          className="fa fa-phone"
                          style={{ marginRight: "5px" }}
                        ></i>
                        Audio meeting
                      </>
                    ) : userRow?.latest_chat_data?.message_type ===
                      "video_meeting" ? (
                      <>
                        <i
                          className="fa fa-video"
                          style={{ marginRight: "5px" }}
                        ></i>
                        Video meeting
                      </>
                    ) : (
                      userRow?.latest_chat_data?.message
                    )}
                  </span>
                  {userRow?.unread_messages_count > 0 && (
                    <Badge
                      sx={{ position: "absolute", right: 0, bottom: 8 }}
                      size="sm"
                      variant="filled"
                      color="red"
                    >
                      {userRow?.unread_messages_count}
                    </Badge>
                  )}
                </div>
              </div>
            ))
            : ""}
        </div>
      </div>
    </div>
  );
};

export default ChatLeftSideNav;
