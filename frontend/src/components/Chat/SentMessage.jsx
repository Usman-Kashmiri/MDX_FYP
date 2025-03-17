import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import AttachmentViewer from "./bubblebox/AttachmentViewer";
import SentCallMessage from "./bubblebox/SentCallMessage";

const SentMessage = ({ data, chatUser, timeState, setAttachSrc }) => {
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
      className="px-0 message-container right justify-content-end d-flex position-relative"
    >
      <div className="d-flex flex-column">
        {timeState !== "Invalid date" && (
          <span className="font-poppins fw-semibold mb-1 msg-timestamp">
            {timeState}
          </span>
        )}

        <div className="message py-2 px-3">
          {data?.attach && (
            <AttachmentViewer data={data} setAttachSrc={setAttachSrc} />
          )}

          {data?.message_type === "video_meeting" ||
            data?.message_type === "audio_meeting" ? (
            <SentCallMessage
              meeting_id={data?.meeting_id}
              type={data?.message_type === "video_meeting" ? "video" : "audio"}
              meeting_details={data?.meeting_details}
            />
          ) : null}
          <p className="m-0">
            {data?.message_type === "original_case" ? (
              <>
                <strong>Original Case:</strong>
                <br />
              </>
            ) : data?.message_type === "summarized_case" ? (
              <>
                <strong>Summarized Case:</strong>
                <br />
              </>
            ) : (
              <></>
            )}
            <span dangerouslySetInnerHTML={{ __html: formatedMessage }} />
          </p>

          <span className={`d-flex justify-content-end mt-2 greyscale`}>
            {data?.status === "pending" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14Z"
                  fill="#05b4e9"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 3.25C7.58579 3.25 7.25 3.58579 7.25 4V8C7.25 8.41421 7.58579 8.75 8 8.75C8.41421 8.75 8.75 8.41421 8.75 8V4C8.75 3.58579 8.41421 3.25 8 3.25Z"
                  fill="#05b4e9"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z"
                  fill="#05b4e9"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11 8C11 8.41421 10.6642 8.75 10.25 8.75C9.83579 8.75 9.5 8.41421 9.5 8C9.5 7.58579 9.83579 7.25 10.25 7.25C10.6642 7.25 11 7.58579 11 8Z"
                  fill="#05b4e9"
                />
              </svg>
            ) : (
              <svg
                width="15"
                height="13"
                viewBox="0 0 11 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.7962 0.12332C10.6169 -0.0411067 10.3256 -0.0411067 10.1463 0.12332L3.64348 6.09189L0.784403 3.48755C0.605085 3.32313 0.313807 3.32313 0.134489 3.48755C-0.0448295 3.65198 -0.0448295 3.91818 0.134489 4.08218L3.31989 6.98341C3.49739 7.14574 3.79276 7.14574 3.97026 6.98341L10.7962 0.717948C10.976 0.553942 10.976 0.287327 10.7962 0.12332C10.976 0.287327 10.6169 -0.0411067 10.7962 0.12332Z"
                  fill="#05b4e9"
                />
              </svg>
            )}
          </span>
        </div>
      </div>
    </Col>
  );
};

export default SentMessage;
