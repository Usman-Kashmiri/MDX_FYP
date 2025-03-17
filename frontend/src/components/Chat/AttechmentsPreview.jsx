import React from "react";
import { GrClose } from "react-icons/gr";
import FilePreview from "../FilePreview"; // Import the FilePreview component

const AttechmentsPreview = ({ setAttechment, attechment }) => {
  return (
    <div className="attachmentPreview">
      <div className="attachmentPreviewHeader">
        <p>{attechment.name}</p>
        <button
          type="button"
          onClick={() => {
            setAttechment(null);
          }}
        >
          <GrClose />
        </button>
      </div>

      {/* Use the FilePreview component to render the attachment */}
      <FilePreview attachment={attechment} />
    </div>
  );
};

export default AttechmentsPreview;
