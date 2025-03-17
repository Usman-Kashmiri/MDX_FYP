import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import AttachmentViewer from "./bubblebox/AttachmentViewer";
import RecievedCallMessage from "./bubblebox/RecievedCallMessage";
import { Avatar } from "@mantine/core";

const ReceivedMessage = ({ data, chatUser, timeState, setAttachSrc }) => {
  const [formatedMessage, setFormatedMessage] = useState("");

  const formatMessage = (message = "") => {
    // Regular expression to match phone numbers
    const phoneRegex = /\b\d{7,15}\b/g;

    // Regular expression to match URLs
    const urlRegex =
      /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/gi;

    // Regular expression to match email addresses
    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w+\b/g;

    const messageWithLinks = message
      .replace(phoneRegex, (match) => {
        // Make phone numbers clickable
        return `<a href="tel:${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
      })
      .replace(urlRegex, (match) => {
        // Make HTTP/HTTPS links clickable and open in a new tab
        if (match.startsWith("http://") || match.startsWith("https://")) {
          return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
        }
        // Keep other links as plain text
        return match;
      })
      .replace(emailRegex, (match) => {
        // Make email addresses clickable and open the default email client
        return `<a href="mailto:${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
      });

    return messageWithLinks;
  };

  useEffect(() => {
    const msg = formatMessage(data.message);
    setFormatedMessage(msg);
  }, [data]);

  return (
    <Col
      xs={12}
      className={`px-0 message-container left justify-content-start d-flex position-relative`}
    >
      <div className="d-flex align-items-end">
        <Avatar
          src={chatUser?.image}
          className="chat-avatar"
          alt="sender-avatar"
          radius={1000}
        // w={100}
        // h={100}
        />
        <div className="d-flex flex-column">
          {timeState !== "Invalid date" && (
            <span className="font-poppins fw-semibold mb-1 msg-timestamp">
              {timeState}
            </span>
          )}
          <div
            className={`message py-2 px-2 position-relative ${data?.message_type === "note"
                ? "note-msg bg-dark-color text-white"
                : "bg-white"
              }`}
          >
            <div className="messagesOfChats">
              {data?.attach && (
                <AttachmentViewer data={data} setAttachSrc={setAttachSrc} />
              )}
              {data?.message_type === "video_meeting" ||
                data?.message_type === "audio_meeting" ? (
                <RecievedCallMessage
                  meeting_id={data?.meeting_id}
                  chatUser={chatUser}
                  type={
                    data?.message_type === "video_meeting" ? "video" : "audio"
                  }
                  meeting_details={data?.meeting_details}

                />
              ) : null}
              <span dangerouslySetInnerHTML={{ __html: formatedMessage }} />
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ReceivedMessage;
