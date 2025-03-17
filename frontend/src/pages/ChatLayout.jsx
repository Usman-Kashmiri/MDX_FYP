import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ChatBox from "../components/Chat/ChatBox";
import ChatLeftSideNav from "../components/Chat/ChatLeftSideNav";
import ChatRightAside from "../components/Chat/ChatRightAside";
import IconsAside from "../components/Chat/IconsAside";
import logo from "../assets/images/Logo.svg";
import Fade from "react-reveal/Fade";
import { useLocation, useParams } from "react-router-dom";
import {
  fetchAllMessages,
  getChatListById,
  peopleChatList,
} from "../redux/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import Pusher from "pusher-js";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Video from "yet-another-react-lightbox/plugins/video";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { pusher } from "../services/pusherConfig";

const ChatLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { id: senderId } = useParams();
  const [chatUser, setChatUser] = useState(null);
  const thumbnailsRef = useRef(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const { users, attachmentList } = useSelector((state) => state?.chat);

  const [lightboxPayload, setLightboxPayload] = useState({
    senderId: 0,
    attachType: "",
  });

  const [showLeftChatSide, setShowLeftChatSide] = useState(
    window.innerWidth >= 992
  );

  useEffect(() => {
    setChatUser(users.find((user) => user.id === Number(senderId)));
  }, [users, senderId, dispatch]);

  useEffect(() => {
    if (users.length === 0) {
      console.log('mere nichy people list hai or me chat layout me hon');
      dispatch(peopleChatList());
    }
  }, []);

  useEffect(() => {
    if (senderId) {
      

      const channel = pusher.subscribe(`my-channel.${senderId}`);

      const handlePusherEvent = async (data) => {
        await dispatch(fetchAllMessages(data?.data[0]));
      };

      channel.bind(`my-event.${senderId}`, handlePusherEvent);
      return () => {
        // ! Unsubscribe from the channel and remove event listener when the component unmounts
        pusher.unsubscribe(`my-channel.${senderId}`);
        channel.unbind(`my-event.${senderId}`, handlePusherEvent);
      };
    } else {
      setChatUser(location?.state?.userData);
    }

    if (window.innerWidth < 992) {
      setShowLeftChatSide(false);
    }
  }, []);

  const [showRightChatSide, setShowRightChatSide] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isXLScreen, setISXLScreen] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const updateIsMediumScreen = () => {
      setIsMediumScreen(window.innerWidth <= 992);
      setISXLScreen(window.innerWidth >= 1200);
    };

    updateIsMediumScreen();

    // Add a resize event listener to detect changes in window width
    window.addEventListener("resize", updateIsMediumScreen);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateIsMediumScreen);
    };
  }, []);

  useEffect(() => {
    if (
      !isXLScreen &&
      !(location.state?.lawyer_id || location.state?.userData?.id)
    ) {
      setShowLeftChatSide(true);
    }
  }, [isXLScreen, location?.state?.lawyer_id, location.state?.userData?.id]);

  useEffect(() => {
    if (senderId) {
      setShowLeftChatSide(false);
    }
  }, [senderId]);

  return (
    <Fade>
      <div style={{ overflow: "hidden", maxWidth: "100%", margin: "0" }}>
        <Row
          className="max-vw-100 vh-100"
          style={{
            margin: "0",
            backgroundColor: chatUser ? "#f7f7f7" : "#ecf0f5",
          }}
        >
          <Col
            xs={12}
            lg={showRightChatSide ? 3 : 4}
            style={{ transition: ".5s" }}
            className={`max-vh-100 leftSideBar ${
              showLeftChatSide ? "active" : ""
            }`}
          >
            <Row style={{ backgroundColor: "white" }}>
              <Col lg={2} sm={1} xs={2} className="icon-aside border-end">
                <IconsAside />
              </Col>
              <Col lg={10} sm={11} xs={10} className="p-1">
                <ChatLeftSideNav
                  setChatUser={setChatUser}
                  isMediumScreen={isMediumScreen}
                  isOpen={(bool) => {
                    setShowLeftChatSide(bool);
                  }}
                  chatUser={chatUser}
                />
              </Col>
            </Row>
          </Col>
          {senderId ? (
            <>
              <Col
                className={`w-100 max-vh-100 chatBoxContainer px-0 ${
                  isXLScreen && showRightChatSide ? "active" : ""
                }`}
              >
                <ChatBox
                  isOpenAnyOne={(isLeft, bool, senderId) => {
                    if (isLeft) {
                      setShowLeftChatSide(bool);
                    } else {
                      setShowRightChatSide(bool);
                      setLightboxPayload((val) => {
                        return {
                          ...val,
                          senderId,
                        };
                      });
                    }
                  }}
                  showRightChatSide={showRightChatSide}
                  isXLScreen={isXLScreen}
                  chatUser={chatUser}
                />
              </Col>

              <Col
                xs={12}
                xl={3}
                className={`max-vh-100 rightSideBar ${
                  showRightChatSide ? "active" : ""
                }`}
              >
                <div style={{ height: "100%" }}>
                  <ChatRightAside
                    lightboxPayload={lightboxPayload}
                    setLightboxPayload={setLightboxPayload}
                    isLightboxOpen={isLightboxOpen}
                    setIsLightboxOpen={setIsLightboxOpen}
                    setActiveSlideIndex={setActiveSlideIndex}
                    chatUser={chatUser}
                    isOpenAnyOne={(bool) => {
                      setShowRightChatSide(bool);
                    }}
                    showRightChatAside={showRightChatSide}
                  />
                </div>
              </Col>
            </>
          ) : (
            !senderId && (
              <Col className="m-auto">
                <div className="d-flex justify-content-center align-items-center">
                  <img src={logo} alt="judge svg" style={{ height: "40vh" }} />
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <p className="text-poppins fs-3 fw-bold">
                    Start your conversation, send & receive messages!
                  </p>
                </div>
              </Col>
            )
          )}
          {showRightChatSide && (
            <span
              className="overlayOfRight"
              onClick={() => {
                setShowRightChatSide(false);
              }}
            ></span>
          )}
        </Row>
      </div>
      <div>
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          index={activeSlideIndex}
          thumbnails={{ ref: thumbnailsRef }}
          slides={attachmentList?.map((item) => {
            if (item?.extension?.split("/")[0] === "video") {
              return {
                type: item?.extension?.split("/")[0],
                width: "80%",
                height: "80%",
                poster: false,
                sources: [
                  {
                    src: item?.link,
                    type: item?.extension,
                  },
                ],
              };
            }
            return {
              src: item?.link,
            };
          })}
          on={{
            click: () => {
              (thumbnailsRef.current?.visible
                ? thumbnailsRef.current?.hide
                : thumbnailsRef.current?.show)?.();
            },
          }}
          plugins={[Download, Video, Thumbnails]}
        />
      </div>
    </Fade>
  );
};

export default ChatLayout;
