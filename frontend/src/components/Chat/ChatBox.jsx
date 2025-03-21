import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ChatBoxHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import SendMessageBox from "./SendMessageBox";
import AttechmentsPreview from "./AttechmentsPreview";
import { GrClose } from "react-icons/gr";
import { FiDownload } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group, Text, rem } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

const ChatBox = ({ isOpenAnyOne, chatUser }) => {
  const [attechment, setAttechment] = useState(null);
  const { id: senderId } = useParams();

  const [caseStatus, setCaseStatus] = useState(0);

  const [attachSrc, setAttachSrc] = useState({
    isClickable: false,
    src: "",
    type: "",
  });

  const [callRequest, setCallRequest] = useState({
    message_type: "",
    isClickable: false,
  });

  useEffect(() => {
    setAttachSrc({
      isClickable: false,
      src: "",
      type: "",
    });
  }, [senderId]);

  return (
    <Container
      fluid
      className="chatBoxParentContainer p-0 bg-white max-vh-100 d-flex align-items-center justify-content-center w-100"
    >
      <div className="chat-box h-100 position-relative w-100 rounded-md-0 rounded-lg-5 ">
        <ChatBoxHeader
          setCallRequest={setCallRequest}
          isOpenAnyOne={isOpenAnyOne}
          chatUser={chatUser}
        />
        <div className="position-absolute top-0 start-0 h-100 p-0 m-0 w-100">
          {attechment ? (
            <AttechmentsPreview
              attechment={attechment}
              setAttechment={setAttechment}
              setAttachSrc={setAttachSrc}
            />
          ) : (
            ""
          )}
          {attachSrc?.type !== null && attachSrc.isClickable ? (
            <AttechmentsPreviewForClick
              setAttachSrc={setAttachSrc}
              attachSrc={attachSrc}
            />
          ) : (
            ""
          )}
          <ChatMessages
            chatUser={chatUser}
            caseStatus={caseStatus}
            setCaseStatus={setCaseStatus}
            setAttachSrc={setAttachSrc}
          />
          <SendMessageBox
            setCallRequest={setCallRequest}
            chatUser={chatUser}
            callRequest={callRequest}
            setAttechment={setAttechment}
            attechment={attechment}
            caseStatus={caseStatus}
          />
        </div>
      </div>
      <Dropzone.FullScreen
        active={true}
        accept={IMAGE_MIME_TYPE}
        onDrop={(files) => {
          setAttechment(files[0]);
          console.log(files[0]);
          // setActive(false);
        }}
      >
        <Group
          // justify="center"
          // align="center"
          gap="xl"
          // mih={220}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{ height: "100vh", width: "100%" }}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <Dropzone.Accept>
              {/* <IconUpload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "#e18700",
                }}
                stroke={1.5}
              /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="240"
                height="240"
                fill="none"
                viewBox="0 0 340 360"
              >
                <circle
                  cx="166.332"
                  cy="192.557"
                  r="128.889"
                  fill="#EB9F2D"
                  fillOpacity="0.13"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint0_linear_109_444)"
                  transform="matrix(-1 0 0 1 11.611 232.222)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint1_linear_109_444)"
                  transform="matrix(-1 0 0 1 17.168 144.444)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint2_linear_109_444)"
                  transform="matrix(-1 0 0 1 32.723 126.667)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint3_linear_109_444)"
                  transform="matrix(-1 0 0 1 97.168 114.444)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint4_linear_109_444)"
                  transform="matrix(-1 0 0 1 97.168 74.445)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint5_linear_109_444)"
                  transform="matrix(-1 0 0 1 110.5 61.111)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint6_linear_109_444)"
                  transform="matrix(-1 0 0 1 32.723 48.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint7_linear_109_444)"
                  transform="matrix(-1 0 0 1 17.168 180)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint8_linear_109_444)"
                  transform="matrix(-1 0 0 1 32.723 193.333)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint9_linear_109_444)"
                  transform="matrix(-1 0 0 1 228.277 48.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint10_linear_109_444)"
                  transform="matrix(-1 0 0 1 201.611 74.445)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint11_linear_109_444)"
                  transform="matrix(-1 0 0 1 259.389 118.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint12_linear_109_444)"
                  transform="matrix(-1 0 0 1 272.723 160)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint13_linear_109_444)"
                  transform="matrix(-1 0 0 1 312.723 172.222)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint14_linear_109_444)"
                  transform="matrix(-1 0 0 1 272.723 184.444)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint15_linear_109_444)"
                  transform="matrix(-1 0 0 1 259.389 263.333)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint16_linear_109_444)"
                  transform="matrix(-1 0 0 1 283.834 355.556)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint17_linear_109_444)"
                  transform="matrix(-1 0 0 1 180.5 327.778)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint18_linear_109_444)"
                  transform="matrix(-1 0 0 1 194.943 288.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint19_linear_109_444)"
                  transform="matrix(-1 0 0 1 244.943 277.778)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint20_linear_109_444)"
                  transform="matrix(-1 0 0 1 169.389 288.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint21_linear_109_444)"
                  transform="matrix(-1 0 0 1 156.057 303.333)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint22_linear_109_444)"
                  transform="matrix(-1 0 0 1 109.389 271.111)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint23_linear_109_444)"
                  transform="matrix(-1 0 0 1 83.834 298.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint24_linear_109_444)"
                  transform="matrix(-1 0 0 1 88.277 266.667)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint25_linear_109_444)"
                  transform="matrix(-1 0 0 1 83.834 246.667)"
                ></circle>
                <circle
                  cx="3.333"
                  cy="3.333"
                  r="3.333"
                  fill="url(#paint26_linear_109_444)"
                  transform="matrix(-1 0 0 1 44.943 264.444)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint27_linear_109_444)"
                  fillOpacity="0.8"
                  transform="matrix(-1 0 0 1 168.277 47.778)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint28_linear_109_444)"
                  fillOpacity="0.8"
                  transform="matrix(-1 0 0 1 108.279 0)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint29_linear_109_444)"
                  transform="matrix(-1 0 0 1 254.945 83.333)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint30_linear_109_444)"
                  transform="matrix(-1 0 0 1 339.389 123.333)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint31_linear_109_444)"
                  fillOpacity="0.8"
                  transform="matrix(-1 0 0 1 333.832 221.111)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint32_linear_109_444)"
                  transform="matrix(-1 0 0 1 218.279 332.222)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint33_linear_109_444)"
                  transform="matrix(-1 0 0 1 124.945 332.222)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint34_linear_109_444)"
                  fillOpacity="0.81"
                  transform="matrix(-1 0 0 1 308.277 271.111)"
                ></circle>
                <g filter="url(#filter0_d_109_444)">
                  <circle
                    cx="166.229"
                    cy="192.455"
                    r="85.555"
                    fill="url(#paint35_linear_109_444)"
                  ></circle>
                </g>
                <path
                  fill="#fff"
                  d="M141.627 169.782h18.986a2 2 0 011.789 1.105l3.339 6.678a2 2 0 001.789 1.105h23.986a2 2 0 012 2v26.223a9 9 0 01-9 9h-35.889a9 9 0 01-9-9v-35.111a2 2 0 012-2z"
                ></path>
                <path
                  fill="#DD9427"
                  d="M165.043 209.226a1.25 1.25 0 002.5 0h-2.5zm2.134-24.773a1.25 1.25 0 00-1.768 0l-7.955 7.955a1.25 1.25 0 001.768 1.768l7.071-7.071 7.071 7.071a1.25 1.25 0 001.768-1.768l-7.955-7.955zm.366 24.773v-23.889h-2.5v23.889h2.5z"
                ></path>
                <defs>
                  <filter
                    id="filter0_d_109_444"
                    width="201.111"
                    height="201.111"
                    x="65.674"
                    y="95.9"
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                  >
                    <feFlood
                      floodOpacity="0"
                      result="BackgroundImageFix"
                    ></feFlood>
                    <feColorMatrix
                      in="SourceAlpha"
                      result="hardAlpha"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    ></feColorMatrix>
                    <feMorphology
                      in="SourceAlpha"
                      operator="dilate"
                      radius="3"
                      result="effect1_dropShadow_109_444"
                    ></feMorphology>
                    <feOffset dy="4"></feOffset>
                    <feGaussianBlur stdDeviation="6"></feGaussianBlur>
                    <feComposite in2="hardAlpha" operator="out"></feComposite>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
                    <feBlend
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_109_444"
                    ></feBlend>
                    <feBlend
                      in="SourceGraphic"
                      in2="effect1_dropShadow_109_444"
                      result="shape"
                    ></feBlend>
                  </filter>
                  <linearGradient
                    id="paint0_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint4_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint5_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint6_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint7_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint8_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint9_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint10_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint11_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint12_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint13_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint14_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint15_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint16_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint17_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint18_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint19_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint20_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint21_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint22_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint23_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint24_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint25_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint26_linear_109_444"
                    x1="3.333"
                    x2="3.333"
                    y1="0"
                    y2="6.667"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint27_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint28_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint29_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint30_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint31_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint32_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint33_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint34_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint35_linear_109_444"
                    x1="166.229"
                    x2="166.229"
                    y1="106.9"
                    y2="278.011"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "#e18700",
                }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              {/* <IconPhoto
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "#e18700",
                }}
                stroke={1.5}
              /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="340"
                height="360"
                fill="none"
                viewBox="0 0 340 360"
              >
                <circle
                  cx="166.332"
                  cy="192.557"
                  r="128.889"
                  fill="#EB9F2D"
                  fillOpacity="0.13"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint0_linear_109_444)"
                  transform="matrix(-1 0 0 1 11.611 232.222)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint1_linear_109_444)"
                  transform="matrix(-1 0 0 1 17.168 144.444)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint2_linear_109_444)"
                  transform="matrix(-1 0 0 1 32.723 126.667)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint3_linear_109_444)"
                  transform="matrix(-1 0 0 1 97.168 114.444)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint4_linear_109_444)"
                  transform="matrix(-1 0 0 1 97.168 74.445)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint5_linear_109_444)"
                  transform="matrix(-1 0 0 1 110.5 61.111)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint6_linear_109_444)"
                  transform="matrix(-1 0 0 1 32.723 48.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint7_linear_109_444)"
                  transform="matrix(-1 0 0 1 17.168 180)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint8_linear_109_444)"
                  transform="matrix(-1 0 0 1 32.723 193.333)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint9_linear_109_444)"
                  transform="matrix(-1 0 0 1 228.277 48.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint10_linear_109_444)"
                  transform="matrix(-1 0 0 1 201.611 74.445)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint11_linear_109_444)"
                  transform="matrix(-1 0 0 1 259.389 118.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint12_linear_109_444)"
                  transform="matrix(-1 0 0 1 272.723 160)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint13_linear_109_444)"
                  transform="matrix(-1 0 0 1 312.723 172.222)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint14_linear_109_444)"
                  transform="matrix(-1 0 0 1 272.723 184.444)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint15_linear_109_444)"
                  transform="matrix(-1 0 0 1 259.389 263.333)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint16_linear_109_444)"
                  transform="matrix(-1 0 0 1 283.834 355.556)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint17_linear_109_444)"
                  transform="matrix(-1 0 0 1 180.5 327.778)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint18_linear_109_444)"
                  transform="matrix(-1 0 0 1 194.943 288.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint19_linear_109_444)"
                  transform="matrix(-1 0 0 1 244.943 277.778)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint20_linear_109_444)"
                  transform="matrix(-1 0 0 1 169.389 288.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint21_linear_109_444)"
                  transform="matrix(-1 0 0 1 156.057 303.333)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint22_linear_109_444)"
                  transform="matrix(-1 0 0 1 109.389 271.111)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint23_linear_109_444)"
                  transform="matrix(-1 0 0 1 83.834 298.889)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint24_linear_109_444)"
                  transform="matrix(-1 0 0 1 88.277 266.667)"
                ></circle>
                <circle
                  cx="2.222"
                  cy="2.222"
                  r="2.222"
                  fill="url(#paint25_linear_109_444)"
                  transform="matrix(-1 0 0 1 83.834 246.667)"
                ></circle>
                <circle
                  cx="3.333"
                  cy="3.333"
                  r="3.333"
                  fill="url(#paint26_linear_109_444)"
                  transform="matrix(-1 0 0 1 44.943 264.444)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint27_linear_109_444)"
                  fillOpacity="0.8"
                  transform="matrix(-1 0 0 1 168.277 47.778)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint28_linear_109_444)"
                  fillOpacity="0.8"
                  transform="matrix(-1 0 0 1 108.279 0)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint29_linear_109_444)"
                  transform="matrix(-1 0 0 1 254.945 83.333)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint30_linear_109_444)"
                  transform="matrix(-1 0 0 1 339.389 123.333)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint31_linear_109_444)"
                  fillOpacity="0.8"
                  transform="matrix(-1 0 0 1 333.832 221.111)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint32_linear_109_444)"
                  transform="matrix(-1 0 0 1 218.279 332.222)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint33_linear_109_444)"
                  transform="matrix(-1 0 0 1 124.945 332.222)"
                ></circle>
                <circle
                  cx="5.556"
                  cy="5.556"
                  r="5.556"
                  fill="url(#paint34_linear_109_444)"
                  fillOpacity="0.81"
                  transform="matrix(-1 0 0 1 308.277 271.111)"
                ></circle>
                <g filter="url(#filter0_d_109_444)">
                  <circle
                    cx="166.229"
                    cy="192.455"
                    r="85.555"
                    fill="url(#paint35_linear_109_444)"
                  ></circle>
                </g>
                <path
                  fill="#fff"
                  d="M141.627 169.782h18.986a2 2 0 011.789 1.105l3.339 6.678a2 2 0 001.789 1.105h23.986a2 2 0 012 2v26.223a9 9 0 01-9 9h-35.889a9 9 0 01-9-9v-35.111a2 2 0 012-2z"
                ></path>
                <path
                  fill="#DD9427"
                  d="M165.043 209.226a1.25 1.25 0 002.5 0h-2.5zm2.134-24.773a1.25 1.25 0 00-1.768 0l-7.955 7.955a1.25 1.25 0 001.768 1.768l7.071-7.071 7.071 7.071a1.25 1.25 0 001.768-1.768l-7.955-7.955zm.366 24.773v-23.889h-2.5v23.889h2.5z"
                ></path>
                <defs>
                  <filter
                    id="filter0_d_109_444"
                    width="201.111"
                    height="201.111"
                    x="65.674"
                    y="95.9"
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                  >
                    <feFlood
                      floodOpacity="0"
                      result="BackgroundImageFix"
                    ></feFlood>
                    <feColorMatrix
                      in="SourceAlpha"
                      result="hardAlpha"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    ></feColorMatrix>
                    <feMorphology
                      in="SourceAlpha"
                      operator="dilate"
                      radius="3"
                      result="effect1_dropShadow_109_444"
                    ></feMorphology>
                    <feOffset dy="4"></feOffset>
                    <feGaussianBlur stdDeviation="6"></feGaussianBlur>
                    <feComposite in2="hardAlpha" operator="out"></feComposite>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
                    <feBlend
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_109_444"
                    ></feBlend>
                    <feBlend
                      in="SourceGraphic"
                      in2="effect1_dropShadow_109_444"
                      result="shape"
                    ></feBlend>
                  </filter>
                  <linearGradient
                    id="paint0_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint4_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint5_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint6_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint7_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint8_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint9_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint10_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint11_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint12_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint13_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint14_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint15_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint16_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint17_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint18_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint19_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint20_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint21_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint22_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint23_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint24_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint25_linear_109_444"
                    x1="2.222"
                    x2="2.222"
                    y1="0"
                    y2="4.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint26_linear_109_444"
                    x1="3.333"
                    x2="3.333"
                    y1="0"
                    y2="6.667"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint27_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint28_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint29_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint30_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint31_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint32_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint33_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint34_linear_109_444"
                    x1="5.556"
                    x2="5.556"
                    y1="0"
                    y2="11.111"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint35_linear_109_444"
                    x1="166.229"
                    x2="166.229"
                    y1="106.9"
                    y2="278.011"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EB9F2D"></stop>
                    <stop offset="1" stopColor="#B47414"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline color="#e18700">
                Drag images here or click to select files
              </Text>
            </div>
          </div>
        </Group>
      </Dropzone.FullScreen>
    </Container>
  );
};

export default ChatBox;

export const Meeting = (props) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "300px",
        }}
      >
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Video Call
        </p>
        <p style={{ fontSize: "10px" }}>{props?.name}</p>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            style={{
              background: "blue",
              color: "white",
              padding: "0.4rem 0.8rem",
              border: "none",
              borderRadius: "5px",
              fontSize: "12px",
            }}
          >
            Join Now
          </button>
          <button
            style={{
              background: "red",
              color: "white",
              padding: "0.4rem 0.8rem",
              border: "none",
              borderRadius: "5px",
              fontSize: "12px",
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </>
  );
};

const AttechmentsPreviewForClick = ({ attachSrc, setAttachSrc }) => {
  return (
    <div className="attachmentPreview">
      <div className="attachmentPreviewHeader">
        {attachSrc?.type !== "pdf" ? (
          <a
            href={attachSrc?.src}
            download="attachment"
            style={{
              textDecoration: "none",
              color: "black",
            }}
            target="_blank"
          >
            <FiDownload />
          </a>
        ) : (
          <span></span>
        )}
        <button
          type="button"
          onClick={() => {
            setAttachSrc({
              isClickable: false,
              src: "",
              type: "",
            });
          }}
        >
          <GrClose />
        </button>
      </div>

      {/* Conditionally render different elements based on attachSrc.type */}
      {attachSrc?.type === "image" ? (
        <img
          src={attachSrc?.src}
          alt="Img Attachment"
          className="cursor-pointer"
        />
      ) : attachSrc?.type === "video" ? (
        <video src={attachSrc?.src} controls className="cursor-pointer" />
      ) : attachSrc?.type === "audio" ? (
        <audio src={attachSrc?.src} controls className="cursor-pointer" />
      ) : attachSrc?.type === "pdf" ? (
        <iframe
          src={attachSrc?.src}
          title={attachSrc?.src + "?#view=fitH"} // Provide a title for accessibility
          type="application/pdf"
          className="pdf-iframe"
        />
      ) : (
        <a href={attachSrc?.src} target="_blank" rel="noopener noreferrer">
          View Attachment
        </a>
      )}
    </div>
  );
};
