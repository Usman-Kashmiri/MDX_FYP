import React, { useEffect, useRef, useState } from "react";
import { Col } from "react-bootstrap";
import Picker from "emoji-picker-react";
import { useDispatch } from "react-redux";
import {
  createChat,
  fetchAllMessages,
  sendNewMessage,
} from "../../redux/actions/chatActions";
import { Popover, Textarea } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import Pusher from "pusher-js";

const SendMessageBox = ({
  chatUser,
  setAttechment,
  attechment,
  callRequest,
  setCallRequest,
  caseStatus,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: senderId } = useParams();
  const myID = JSON.parse(localStorage.getItem("user"))?.id;
  const [showPicker, setShowPicker] = useState(false);
  const [inputStr, setInputStr] = useState("");
  const [Loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmitSendMessage = async (e = null) => {
    e?.preventDefault();

    if (inputStr.trim() === "" && !attechment && !callRequest?.isClickable) {
      setInputStr("");
      return;
    }

    setAttechment(null);

    const newMessage = {
      alignment: "right",
      appointment_detail: null,
      appointment_id: 0,
      attach_type: attechment ? getAttachmentFileType(attechment) : null,
      attach: attechment ? URL?.createObjectURL(attechment) : null,
      attach_display_name: attechment?.name,
      id: null,
      message: callRequest?.message_type !== "" ? "" : inputStr,
      message_type: callRequest?.message_type || null,
      recevier_id: chatUser?.id,
      sender_id: myID,
      time_stamp: Date.now(),
      status: "pending",
      hi: true,
    };

    dispatch(sendNewMessage({ message: newMessage, id: chatUser?.id }));

    const formdata = new FormData();

    if (callRequest?.message_type !== "") {
      formdata.append("message_type", callRequest?.message_type);
      formdata.append("message", inputStr || "");
    } else {
      formdata.append("message", inputStr);
      formdata.append("message_type", "chat");
      showPicker && setShowPicker(false);
    }

    formdata.append("recevier_id", chatUser?.id);
    formdata.append("attach", attechment);
    formdata.append("time_stamp", Date.now());
    setLoading(true);
    try {
      setInputStr("");
      setAttechment(null);

      const msg = await dispatch(createChat(formdata));

      msg?.message_type === "video_meeting" &&
        navigate(`/dashboard/video-meeting/${msg.meeting_id}`);
      msg?.message_type === "audio_meeting" &&
        navigate(`/dashboard/video-meeting/${msg.meeting_id}`);

      setLoading(false);
      if (callRequest?.message_type !== "") {
        setCallRequest({
          message_type: "",
          isClickable: false,
        });
      }
    } catch (error) {
      setLoading(false);
    }
    fileInputRef.current.value = null;
  };

  useEffect(() => {
    if (callRequest?.isClickable) {
      handleSubmitSendMessage();
    }
  }, [callRequest]);

  const handleAttechments = (file) => {
    setAttechment(file);
  };

  return (
    <div className="chat-box-footer px-3 pb-4 position-absolute w-100 start-0 bottom-0">
      <form
        onSubmit={handleSubmitSendMessage}
        className="px-3 py-2 send-message-box rounded-4 bg-white d-flex"
      >
        <div className="ps-0 pe-2 w-100">
          <Textarea
            placeholder="jot something down"
            className="message-input border-0 w-100 h-100"
            sx={{
              cursor: caseStatus !== 1 ? "not-allowed" : "default",
              fontFamily: "Arial Unicode MS, monospace",
              textarea: {
                backgroundColor: "transparent !important",
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitSendMessage();
              }
            }}
            disabled={caseStatus !== 1}
            autosize
            minRows={1}
            maxRows={5}
            value={inputStr}
            onChange={(e) => {
              showPicker && setShowPicker(false);
              setInputStr(e.target.value);
            }}
          />
        </div>
        <Col
          xs={4}
          className="d-flex align-items-center justify-content-end gap-3 px-0 w-auto"
        >
          <div>
            <Popover position="top" offset={16}>
              <Popover.Dropdown
                sx={{
                  padding: 0,
                  background: "none",
                }}
              >
                {/* // ? emoji picker */}
                <Picker
                  onEmojiClick={(emojiObject) => {
                    if (emojiObject && emojiObject.emoji) {
                      setInputStr((prevMsg) => prevMsg + emojiObject.emoji);
                    }
                  }}
                />
              </Popover.Dropdown>

              <Popover.Target>
                <span
                  className="emojis-btn"
                  style={{
                    cursor: caseStatus !== 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <i className="fa-solid fa-face-smile"></i>
                </span>
              </Popover.Target>
            </Popover>
          </div>
          <label
            style={{
              cursor: caseStatus !== 1 ? "not-allowed" : "pointer",
            }}
            htmlFor="attechment"
            className="attachment-btn cursor-pointer"
          >
            <input
              onChange={(e) => handleAttechments(e.target.files[0])}
              disabled={
                caseStatus === 0 ||
                caseStatus === null ||
                caseStatus === undefined
              }
              id="attechment"
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml image/gif, image/bmp, video/mp4, video/avi, video/mov, video/wmv, video/flv, audio/mp3, audio/wav, audio/ogg, audio/aac, audio/flac, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, application/rtf, application/zip, application/x-zip-compressed, application/x-rar-compressed, application/octet-stream, application/x-7z-compressed, application/x-tar, application/x-gtar, application/gzip"
              className="d-none"
            />

            <i className="fa fa-paperclip"></i>
          </label>
          <button
            disabled={Loading || caseStatus !== 1}
            className="send-msg-btn cursor-pointer p-2 rounded-3 bg-primary-color border-0"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.38057 11.4766L0.831055 7.70186L21.3226 0.152344L14.3123 20.6439L10.5376 13.0944L14.8516 6.62336L8.38057 11.4766Z"
                fill="white"
              />
            </svg>
          </button>
        </Col>
      </form>
    </div>
  );
};

export default SendMessageBox;

export const getAttachmentFileType = (attachment) => {
  const mimeType = attachment.type;

  if (mimeType.startsWith("image/")) {
    return "image";
  } else if (mimeType.startsWith("video/")) {
    return "video";
  } else if (mimeType.startsWith("audio/")) {
    return "audio";
  } else if (mimeType === "application/pdf") {
    return "pdf";
  } else if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  } else if (mimeType === "text/plain") {
    return "txt";
  } else if (mimeType === "application/rtf") {
    return "rtf";
  } else if (
    ["application/zip", "application/x-zip-compressed"].includes(mimeType)
  ) {
    return "zip";
  } else if (
    ["application/x-rar-compressed", "application/octet-stream"].includes(
      mimeType
    )
  ) {
    return "rar";
  } else if (mimeType === "application/x-7z-compressed") {
    return "7z";
  } else if (["application/x-tar", "application/x-gtar"].includes(mimeType)) {
    return "tar";
  } else if (mimeType === "application/gzip") {
    return "gz";
  } else {
    return "unsupported";
  }
};
