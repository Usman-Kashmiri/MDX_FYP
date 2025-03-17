import React, { useEffect, useState } from "react";
import { attachmentListAction } from "../../redux/actions/chatActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import zipImage from "../../assets/images/chat/extensions/zip-file.png";
import gzImage from "../../assets/images/chat/extensions/gz.png";
import tarImage from "../../assets/images/chat/extensions/tar.png";
import file7ZImage from "../../assets/images/chat/extensions/7z-file.png";
import rarImage from "../../assets/images/chat/extensions/rar-file.png";
import wordImage from "../../assets/images/chat/extensions/word.png";
import txtImage from "../../assets/images/chat/extensions/txt.png";
import rtfImage from "../../assets/images/chat/extensions/rtf.png";
import pdfImage from "../../assets/images/chat/extensions/pdf.png";
import downloadIcon from "../../assets/images/chat/extensions/download-icon.png";
import { Avatar, Indicator, Loader } from "@mantine/core";
import { useParams } from "react-router-dom";

const ChatRightAside = ({
  isOpenAnyOne,
  chatUser,
  isLightboxOpen,
  setIsLightboxOpen,
  setLightboxPayload,
  lightboxPayload,
  setActiveSlideIndex,
  showRightChatAside,
}) => {
  const dispatch = useDispatch();
  const { id: senderId } = useParams();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { loading, attachmentList } = useSelector((state) => state?.chat);

  useEffect(() => {
    const updateIsLargeScreen = () => {
      setIsLargeScreen(window.innerWidth > 1200);
    };

    updateIsLargeScreen();

    window.addEventListener("resize", updateIsLargeScreen);

    return () => {
      window.removeEventListener("resize", updateIsLargeScreen);
    };
  }, []);

  useEffect(() => {
    showRightChatAside &&
      lightboxPayload.attachType !== "" &&
      dispatch(attachmentListAction(lightboxPayload?.attachType, senderId));
  }, [chatUser, lightboxPayload]);

  return (
    <div
      className={`pt-4 d-flex flex-column align-items-start max-vh-100 rightSideChatCss`}
      style={{
        backgroundColor: "white",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <div className="back-button-og-right-side-of-chat-ui">
        <button
          className="back-btn rounded-2"
          onClick={() => {
            isOpenAnyOne(false);
          }}
        >
          <i className="fa fa-chevron-right text-grey cursor-pointer"></i>
        </button>
      </div>
      <div className="d-flex flex-column justify-content-between align-items-center avatar-and-online-status border-bottom-0 w-100">
        <div className="user-avatar img-avatar-of-opposite-user-of-right-side-of-chat-ui">
          <div className="outer-div-of-img-of-chat">
            <Indicator
              inline
              size={18}
              offset={25}
              position="bottom-end"
              color={Number(chatUser?.is_online) ? "green" : "red"}
            >
              <Avatar
                src={chatUser?.image}
                alt="sender-profile"
                size={165}
                radius={200}
              />
            </Indicator>
          </div>
        </div>
        <span className="d-flex flex-column">
          <span className="text-start font-poppins fw-semibold mt-1 fs-4">
            {chatUser?.first_name} {chatUser?.last_name}
          </span>
        </span>
      </div>
      <div className="d-flex flex-column w-100 h-100 overflow-hidden ">
        <div className="details-list-box mt-4">
          <span className="list-header d-flex justify-content-between w-100">
            <span>File Type</span>
            <span>
              <i className="fa fa-ellipsis-vertical cursor-pointer"></i>
            </span>
          </span>
          <div className="details-list d-flex flex-column gap-3 mt-4 pt-2 pe-3">
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => {
                setLightboxPayload((val) => {
                  return {
                    ...val,
                    attachType: "image",
                  };
                });
              }}
            >
              <div className="details">
                <span className="d-flex gap-2 align-items-center">
                  <i className="rounded-4 photos-details fa-solid fa-image"></i>
                  <span className="d-flex flex-column">
                    <span className="font-poppins fw-semibold">Images</span>
                  </span>
                </span>
              </div>
              <i
                className={`fa ${
                  lightboxPayload?.attachType === "image"
                    ? "fas fa-chevron-down"
                    : "fa-chevron-right"
                } text-grey cursor-pointer`}
              ></i>
            </div>
            {lightboxPayload?.attachType === "image" && (
              <>
                {loading ? (
                  <div className="d-flex flex-row justify-content-center align-items-center p-3">
                    <Loader color="gray" variant="dots" />
                  </div>
                ) : (
                  <div className="view-container cursor-pointer">
                    {attachmentList?.length > 0 ? (
                      attachmentList?.map((item, index) => {
                        return (
                          <div key={index} className="item-container-attach">
                            <img
                              src={item?.link}
                              alt={item?.file_name}
                              className="item-size"
                              onClick={() => {
                                setActiveSlideIndex(index);
                                setIsLightboxOpen(!isLightboxOpen);
                              }}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <span>Not Found!</span>
                    )}
                  </div>
                )}
              </>
            )}
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => {
                setLightboxPayload((val) => {
                  return {
                    ...val,
                    attachType: "video",
                  };
                });
              }}
            >
              <div className="details">
                <span className="d-flex gap-2 align-items-center">
                  <i className="rounded-4 photos-details fa-solid fa-video"></i>
                  <span className="d-flex flex-column">
                    <span className="font-poppins fw-semibold">Videos</span>
                    {/* <small className="text-start d-none font-poppins text-grey">
                      53 files, 321MB
                    </small> */}
                  </span>
                </span>
              </div>
              <i
                className={`fa ${
                  isLightboxOpen && lightboxPayload?.attachType === "video"
                    ? "fas fa-chevron-down"
                    : "fa-chevron-right"
                } text-grey cursor-pointer`}
              ></i>
            </div>
            {lightboxPayload?.attachType === "video" && (
              <>
                {loading ? (
                  <div className="d-flex flex-row justify-content-center align-items-center p-3">
                    <Loader color="gray" variant="dots" />
                  </div>
                ) : (
                  <div className="view-container cursor-pointer">
                    {attachmentList?.length > 0 ? (
                      attachmentList?.map((item, index) => {
                        return (
                          <div key={index} className="item-container-attach">
                            <video
                              src={item?.link}
                              alt={item?.file_name}
                              className="item-size"
                              onClick={() => {
                                setActiveSlideIndex(index);
                                setIsLightboxOpen(!isLightboxOpen);
                              }}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <span>Not Found!</span>
                    )}
                  </div>
                )}
              </>
            )}
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => {
                setLightboxPayload((val) => {
                  return {
                    ...val,
                    attachType: "audio",
                  };
                });
              }}
            >
              <div className="details">
                <span className="d-flex gap-2 align-items-center">
                  <i className="rounded-4 photos-details fa-solid fa-headphones"></i>
                  <span className="d-flex flex-column">
                    <span className="font-poppins fw-semibold">Audios</span>
                    {/* <small className="text-start d-none font-poppins text-grey">
                      53 files, 321MB
                    </small> */}
                  </span>
                </span>
              </div>
              <i
                className={`fa ${
                  lightboxPayload?.attachType === "audio"
                    ? "fas fa-chevron-down"
                    : "fa-chevron-right"
                } text-grey cursor-pointer`}
              ></i>
            </div>
            {lightboxPayload?.attachType === "audio" && (
              <>
                {loading ? (
                  <div className="d-flex flex-row justify-content-center align-items-center p-3">
                    <Loader color="gray" variant="dots" />
                  </div>
                ) : (
                  <div className="view-container-doc cursor-pointer">
                    {attachmentList?.length > 0 ? (
                      attachmentList?.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="item-container-attach-doc"
                          >
                            <audio src={item?.link} controls />
                          </div>
                        );
                      })
                    ) : (
                      <span>Not Found!</span>
                    )}
                  </div>
                )}
              </>
            )}
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => {
                setLightboxPayload((val) => {
                  return {
                    ...val,
                    attachType: "doc",
                  };
                });
              }}
            >
              <div className="details">
                <span className="d-flex gap-2 align-items-center">
                  <i className="rounded-4 documents-details fa-solid fa-file"></i>
                  <span className="d-flex flex-column">
                    <span className="font-poppins fw-semibold">Documents</span>
                    {/* <small className="text-start d-none font-poppins text-grey">
                      126 files, 193MB
                    </small> */}
                  </span>
                </span>
              </div>
              <i
                className={`fa ${
                  lightboxPayload?.attachType === "doc"
                    ? "fas fa-chevron-down"
                    : "fa-chevron-right"
                } text-grey cursor-pointer`}
              ></i>
            </div>
            {lightboxPayload?.attachType === "doc" && (
              <>
                {loading ? (
                  <div className="d-flex flex-row justify-content-center align-items-center p-3">
                    <Loader color="gray" variant="dots" />
                  </div>
                ) : (
                  <div className="view-container-doc cursor-pointer">
                    {attachmentList?.length > 0 ? (
                      attachmentList?.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="item-container-attach-doc"
                          >
                            <a
                              href={item?.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="attach-document-in-right-side"
                            >
                              <div className="d-flex flex-row justify-content-start item-container-attach-doc-footer align-items-center">
                                <img
                                  src={getExtensionImage(item?.extension)}
                                  style={{
                                    width: "40px",
                                  }}
                                  alt="File Icon"
                                />
                                {`${item?.file_name}` || "Sample.txt"}
                              </div>

                              <div className="download-icon updated-background">
                                <img
                                  src={downloadIcon}
                                  style={{
                                    width: "20px",
                                  }}
                                />
                              </div>
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <span>Not Found!</span>
                    )}
                  </div>
                )}
              </>
            )}
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => {
                setLightboxPayload((val) => {
                  return {
                    ...val,
                    attachType: "file",
                  };
                });
              }}
            >
              <div className="details">
                <span className="d-flex gap-2 align-items-center">
                  <i className="rounded-4 movies-details fa-solid fa-file"></i>
                  <span className="d-flex flex-column">
                    <span className="font-poppins fw-semibold">Files</span>
                    {/* <small className="text-start d-none font-poppins text-grey">
                      3 files, 210MB
                    </small> */}
                  </span>
                </span>
              </div>
              <i
                className={`fa ${
                  lightboxPayload?.attachType === "file"
                    ? "fas fa-chevron-down"
                    : "fa-chevron-right"
                } text-grey cursor-pointer`}
              ></i>
            </div>
            {lightboxPayload?.attachType === "file" && (
              <>
                {loading ? (
                  <div className="d-flex flex-row justify-content-center align-items-center p-3">
                    <Loader color="gray" variant="dots" />
                  </div>
                ) : (
                  <div className="view-container-doc cursor-pointer">
                    {attachmentList?.length > 0 ? (
                      attachmentList?.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="item-container-attach-doc"
                          >
                            <a
                              href={item?.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="attach-document-in-right-side"
                            >
                              <div className="d-flex flex-row justify-content-start item-container-attach-doc-footer align-items-center">
                                <img
                                  src={getExtensionImage(item?.extension)}
                                  style={{
                                    width: "40px",
                                  }}
                                  alt="File Icon"
                                />
                                <span className="">
                                  {`${item?.file_name}` || "Sample.txt"}
                                </span>
                              </div>

                              <div className="download-icon updated-background">
                                <img
                                  src={downloadIcon}
                                  style={{
                                    width: "20px",
                                  }}
                                />
                              </div>
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <span>Not Found!</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRightAside;

function getExtensionImage(fileExtension) {
  switch (fileExtension) {
    case "zip":
      return zipImage;
    case "rar":
      return rarImage;
    case "7z":
      return file7ZImage;
    case "tar":
      return tarImage;
    case "gz":
      return gzImage;
    case "txt":
      return txtImage;
    case "rtf":
      return rtfImage;
    case "pdf":
      return pdfImage;
    case "doc":
    case "docx":
      return wordImage;
    default:
      return null;
  }
}
