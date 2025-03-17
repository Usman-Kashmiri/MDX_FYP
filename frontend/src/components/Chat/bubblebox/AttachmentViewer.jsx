import React from "react";
import PdfViewer from "./pdfViewer"; // Import your PdfViewer component
import zipImage from "../../../assets/images/chat/extensions/zip-file.png";
import gzImage from "../../../assets/images/chat/extensions/gz.png";
import tarImage from "../../../assets/images/chat/extensions/tar.png";
import file7ZImage from "../../../assets/images/chat/extensions/7z-file.png";
import rarImage from "../../../assets/images/chat/extensions/rar-file.png";
import wordImage from "../../../assets/images/chat/extensions/word.png";
import txtImage from "../../../assets/images/chat/extensions/txt.png";
import rtfImage from "../../../assets/images/chat/extensions/rtf.png";
import pdfImage from "../../../assets/images/chat/extensions/pdf.png";
import downloadIcon from "../../../assets/images/chat/extensions/download-icon.png";

const AttachmentViewer = ({ data, setAttachSrc }) => {
  const fileExtension = data?.attach_display_name
    ?.split(".")
    ?.pop()
    ?.toLowerCase();
  if (data.attach_type === "image") {
    return (
      <img
        src={data.attach}
        onClick={() => {
          setAttachSrc({
            isClickable: true,
            src: data.attach,
            type: "image",
          });
        }}
        className="cursor-pointer"
        alt="Image"
      />
    );
  } else if (data.attach_type === "video") {
    return (
      <video
        src={data.attach}
        controls
        className="inner-attach-message cursor-pointer"
        onClick={() => {
          setAttachSrc({
            isClickable: true,
            src: data.attach,
            type: "video",
          });
        }}
      />
    );
  } else if (data.attach_type === "audio") {
    return (
      <audio
        src={data.attach}
        controls
        onClick={() => {
          setAttachSrc({
            isClickable: true,
            src: data.attach,
            type: "audio",
          });
        }}
        className="cursor-pointer"
      />
    );
  } else if (fileExtension === "pdf") {
    return (
      <PdfViewer
        file={data?.attach}
        onClick={() => {
          setAttachSrc({
            isClickable: true,
            src: data.attach,
            type: "pdf",
          });
        }}
        fileName={data?.attach_display_name}
      />
    );
  } else {
    return <AttachFileView data={data} />;
  }
};

export default AttachmentViewer;

export const AttachFileView = ({ data }) => {
  const fileExtension = data?.attach_display_name
    ?.split(".")
    ?.pop()
    ?.toLowerCase();
  const iconImage = getExtensionImage(fileExtension);
  return (
    <a
      href={data.attach}
      target="_blank"
      rel="noopener noreferrer"
      className="attach-document"
    >
      <div className="d-flex flex-row justify-content-start align-items-center">
        <img
          src={iconImage}
          style={{
            width: "40px",
          }}
          alt="File Icon"
        />
        {data?.attach_display_name || "Sample.txt"}
      </div>

      <div className="download-icon">
        <img
          src={downloadIcon}
          style={{
            width: "20px",
          }}
        />
      </div>
    </a>
  );
};

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
