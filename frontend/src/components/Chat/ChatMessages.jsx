import React, { useEffect, useRef, useState } from "react";
import { Row } from "react-bootstrap";
import ReceivedMessage from "./ReceivedMessage";
import SentMessage from "./SentMessage";
import Pusher from "pusher-js";
import { useDispatch, useSelector } from "react-redux";
import Fade from "react-reveal/Fade";
import {
  getChatListById,
  fetchAllMessages,
  markAsReadMessages,
  fetchMoreMessages,
} from "../../redux/actions/chatActions";
import moment from "moment";
import { Box, Loader } from "@mantine/core";
import { useLocation, useParams } from "react-router-dom";
import { pusher } from "../../services/pusherConfig";

const ChatMessages = ({
  chatUser,
  caseStatus,
  setCaseStatus,
  setAttachSrc,
}) => {
  const dispatch = useDispatch();
  const [chatPages, setChatPages] = useState(1);
  const { pathname } = useLocation();
  const state = useSelector((state) => state?.chat);
  const { id: senderId } = useParams();
  const { role } = useSelector((state) => state?.auth?.user?.userData);
  const chatContainerRef = useRef(null);
  const [isInitialLoading, setInitialLoading] = useState(false);
  const [isLoadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!isInitialLoading && !isLoadingMore) {
      setTimeout(() => {
        if (chatContainerRef.current !== null) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight + 999999999 || 99999999999999;
        }
      }, 200);
    }
  }, [isInitialLoading]);

  useEffect(() => {
    if (chatContainerRef.current !== null) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight + 999999999;
    }
  }, [chatContainerRef.current]);

  useEffect(() => {
    const channel = pusher.subscribe(`my-channel.${senderId}`);

    const handlePusherEvent = async (data) => {
      await dispatch(fetchAllMessages(data?.data[0]));
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight + 500;
    };

    channel.bind(`my-event.${senderId}`, handlePusherEvent);

    return () => {
      // ! Unsubscribe from the channel and remove event listener when the component unmounts
      pusher.unsubscribe(`my-channel.${senderId}`);
      channel.unbind(`my-event.${senderId}`, handlePusherEvent);
    };
  }, [senderId]);

  useEffect(() => {
    setCaseStatus(state?.caseStatus);
  }, [state?.messages, senderId]);

  useEffect(() => {
    const unreadMessages = state?.messages?.data?.filter(
      (message) => message?.status === 0 && message?.sender_id !== senderId
    );
    unreadMessages?.length > 0 && dispatch(markAsReadMessages(senderId));
  }, [state?.messages]);

  let currentDate;

  const handleLoadMore = async (e) => {
    if (isInitialLoading || isLoadingMore) {
      return false;
    }
    if (e?.target) {
      const { scrollTop } = e?.target;
      if (!isInitialLoading && scrollTop < 40 && !isLoadingMore) {
        if (
          chatPages < state?.messages?.total_pages &&
          state?.messages.data.length < state?.messages?.total_records
        ) {
          setLoadingMore(true);
          setChatPages(chatPages + 1);
          await dispatch(fetchMoreMessages(senderId, chatPages + 1));
          setLoadingMore(false);
        }
      }
    }

    if (
      chatPages >= state?.messages?.total_pages &&
      state?.messages.data.length >= state?.messages?.total_records
    ) {
      setLoadingMore(false);
    }
  };

  const fetchInitialChat = async () => {
    setInitialLoading(true);
    try {
      await dispatch(getChatListById(senderId, 1));
      setInitialLoading(false);
    } catch (error) {
      console.error(error);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    setChatPages(1);
    fetchInitialChat();
  }, [senderId, pathname]);

  return (
    <div id="chat-container" className="chat-messages-conatainer">
      {isInitialLoading ? (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <Loader size={"lg"} color="#db9753" />
        </Box>
      ) : (
        <Row
          id="chat-window"
          className="chat-messages gap-3 px-md-3 px-sm-2 w-100"
          ref={chatContainerRef}
          style={{
            scrollBehavior: "smooth",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {chatPages < state?.messages?.total_pages &&
              state?.messages.data.length < state?.messages?.total_records && (
                <Box
                  sx={{
                    display: "flex",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "75px",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      padding: "6px 16px",
                      color: "black",
                      fontWeight: 500,
                      fontSize: 12,
                      borderRadius: "3px",
                      backgroundColor: "#ffebd9",
                      zIndex: 1,
                      cursor: "pointer",
                    }}
                    onClick={handleLoadMore}
                  >
                    Load More Messages{" "}
                    <span style={{ fontSize: "1.2rem" }}>&#x2193;</span>
                  </Box>
                </Box>
              )}
            {state?.listLoading && state.messagesLoading && (
              <Loader size={"lg"} color="#db9753" />
            )}
          </Box>

          {!state?.messagesLoading && state?.messages?.data?.length > 0 ? (
            <>
              {isLoadingMore && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100px",
                  }}
                >
                  <Loader size={"lg"} color="#db9753" />
                </Box>
              )}

              {state?.messages?.data?.map((item, i) => {
                let formatedDate = moment(parseInt(item?.time_stamp, 10));
                formatedDate = formatedDate.format("MMM DD, YYYY");

                const today = moment().format("MMM DD, YYYY");
                const yesterday = moment()
                  .subtract(1, "days")
                  .format("MMM DD, YYYY");

                let displayDate;

                if (formatedDate === today) {
                  displayDate = "Today";
                } else if (formatedDate === yesterday) {
                  displayDate = "Yesterday";
                } else {
                  displayDate = formatedDate;
                }

                // ? Checking if the date has changed or not.
                if (formatedDate !== currentDate) {
                  currentDate = formatedDate;

                  // ? Checking if the formatted date is valid before rendering
                  if (formatedDate !== "Invalid date") {
                    const Date = (
                      <Fade top>
                        <Box
                          key={`date-${i}`}
                          sx={{
                            display: "flex",
                            position: "relative",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "75px",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              padding: "6px 16px",
                              color: "white",
                              fontWeight: 700,
                              fontSize: 12,
                              borderRadius: "3px",
                              backgroundColor: "#db9753",
                              zIndex: 1,
                            }}
                          >
                            {displayDate}
                          </Box>
                        </Box>
                      </Fade>
                    );

                    return [
                      Date,
                      Message(
                        { item, role, caseStatus, chatUser, setAttachSrc },
                        i
                      ),
                    ];
                  }
                }

                return Message(
                  { item, role, caseStatus, chatUser, setAttachSrc },
                  i
                );
              })}
            </>
          ) : (
            !state.messagesLoading &&
            !state.loading &&
            !state.listLoading && (
              <Fade delay={2000}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    minHeight: "200px",
                  }}
                >
                  <span style={{ color: "#db9753" }}>
                    Start your conversation, send & receive messages!
                  </span>
                </Box>
              </Fade>
            )
          )}
          <div
            style={{
              minWidth: "0.7rem",
            }}
          ></div>
        </Row>
      )}
    </div>
  );
};

const Message = (props, i) => {
  let timeState = moment(parseInt(props?.item?.time_stamp, 10));

  return (
    <React.Fragment key={i}>
      {props?.item?.alignment === "right" ? (
        <React.Fragment key={i}>
          <Fade right>
            <SentMessage
              data={props?.item}
              chatUser={props?.chatUser}
              timeState={timeState.format("hh:mm a")}
              setAttachSrc={props?.setAttachSrc}
            />
          </Fade>

          <Fade left>
            {props.item?.message_type === "summarized_case" &&
              props.caseStatus !== 1 && (
                <ReceivedMessage
                  chatUser={{
                    image:
                      "https://lawyer.dotclick.co/uploads/website/6553506dd7854.svg",
                  }}
                  data={{
                    alignment: "left",
                    appointment_detail: null,
                    appointment_id: 0,
                    attach: null,
                    attach_display_name: null,
                    attach_type: null,
                    id: 0,
                    meeting_id: 0,
                    message:
                      props?.role === "Client"
                        ? "You won't be able to send a message until your case is approved by the lawyer"
                        : "You won't be able to send any message until you approve this case",
                    message_type: "note",
                    recevier_id: props.item?.recevier_id,
                    sender_id: props.item?.sender_id,
                    status: null,
                    time_stamp: null,
                  }}
                  timeState={timeState.format("hh:mm a")}
                  setAttachSrc={props?.setAttachSrc}
                />
              )}
          </Fade>
        </React.Fragment>
      ) : (
        <React.Fragment key={i}>
          <Fade left>
            <ReceivedMessage
              chatUser={props?.chatUser}
              data={props?.item}
              timeState={timeState.format("hh:mm a")}
              setAttachSrc={props?.setAttachSrc}
            />
          </Fade>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ChatMessages;
