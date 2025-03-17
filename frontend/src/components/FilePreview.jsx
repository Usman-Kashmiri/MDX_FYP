import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import zipImage from "../assets/images/chat/extensions/zip-file.png";
import gzImage from "../assets/images/chat/extensions/gz.png";
import tarImage from "../assets/images/chat/extensions/tar.png";
import file7ZImage from "../assets/images/chat/extensions/7z-file.png";
import rarImage from "../assets/images/chat/extensions/rar-file.png";
import wordImage from "../assets/images/chat/extensions/word.png";
import txtImage from "../assets/images/chat/extensions/txt.png";
import rtfImage from "../assets/images/chat/extensions/rtf.png";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function FilePreview({ attachment }) {
  const fileExtension = attachment.name.split(".").pop().toLowerCase();

  const renderContent = () => {
    if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png" ||
      fileExtension === "gif" ||
      fileExtension === "bmp" ||
      fileExtension === "webp"
    ) {
      return <img src={URL.createObjectURL(attachment)} alt="Image" />;
    } else if (
      fileExtension === "mp4" ||
      fileExtension === "avi" ||
      fileExtension === "mov" ||
      fileExtension === "wmv" ||
      fileExtension === "flv"
    ) {
      return <video controls src={URL.createObjectURL(attachment)} />;
    } else if (
      fileExtension === "mp3" ||
      fileExtension === "wav" ||
      fileExtension === "ogg" ||
      fileExtension === "aac" ||
      fileExtension === "flac"
    ) {
      return <audio controls src={URL.createObjectURL(attachment)} />;
    } else if (fileExtension === "pdf") {
      return (
        <Document
          className="sseaesc"
          file={URL.createObjectURL(attachment)}
          options={{
            workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
            toolbar: false,
            navpanes: false,
            scrollbar: false,
          }}
        >
          <Page
            pageNumber={1}
            renderTextLayer={false}
            renderInteractiveForms={false}
          />
        </Document>
      );
    } else if (
      ["zip", "rar", "7z", "tar", "gz", "rtf", "txt", "docx", "doc"].includes(
        fileExtension
      )
    ) {
      // Render file icon for archive types
      const iconImage = getExtensionImage(fileExtension);
      return (
        <div className="extension-icon">
          <img src={iconImage} />
        </div>
      );
    } else {
      // Display a message for unsupported file types
      return <div>This file type is not supported.</div>;
    }
  };

  return <div className="file-preview">{renderContent()}</div>;
}

export default FilePreview;

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
    case "doc":
      return wordImage;
    case "docx":
      return wordImage;
    default:
      return null;
  }
}
