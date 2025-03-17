import React from "react";
import PDFImage from "../../../assets/images/chat/extensions/pdf.png";
import downloadIcon from "../../../assets/images/chat/extensions/download-icon.png";

const PdfViewer = ({ file, fileName, onClick }) => {
  return (
    <div onClick={onClick} className="filebubblemeassage w-100 cursor-pointer">
      <div className="w-100">
        <div className="documentBubbleMessage cursor-pointer">
          <iframe
            src={file}
            title={fileName + "?#view=fitH"} // Provide a title for accessibility
            type="application/pdf"
            className="pdf-iframe"
          />
        </div>
        <div className="documentFotter">
          <div>
            <img src={PDFImage} className="extIcon documentexticon" />
            {fileName}
          </div>
          <a href={file} download={file}>
            <div className="download-icon">
              <img
                src={downloadIcon}
                // style={{
                //   width: "20px",
                // }}
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
