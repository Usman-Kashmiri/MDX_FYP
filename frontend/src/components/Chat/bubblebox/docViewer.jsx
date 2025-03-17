import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PDFImage from "../../../assets/images/chat/extensions/pdf.png";
import { AiOutlineCloudDownload } from "react-icons/ai";

// Set PDF.js worker source for PDF rendering
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocViewer = ({ file }) => {
  // file = pdfFile
  const fileExtension = file.split(".").pop().toLowerCase();

  const supportedExtensions = {
    // Document
    pdxf: (
      <div className="documentBubbleMessage">
        <Document
          file={file}
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
          />{" "}
        </Document>
        {file}
      </div>
    ),

    docx: <xDocument className="documentBubbleMessage  " file={file} />,
    doc: <xDocument className="documentBubbleMessage  " file={file} />,
    txt: <pre>{file}</pre>,
    rtf: <embed src={file} type="application/rtf" />,
    pdf: (
      <div>
        <div className="documentBubbleMessage">
          <iframe
            src={file}
            type="application/pdf"
            style={{ overflow: "hidden" }}
            scrolling="no"
          />
        </div>
        <div className="documentFotter">
          <img src={PDFImage} className="extIcon documentexticon" />
          <a href={file} download={file}>
            <AiOutlineCloudDownload />
          </a>
        </div>
      </div>
    ),
  };
  if (supportedExtensions[fileExtension]) {
    return supportedExtensions[fileExtension];
  } else {
    // Display a message for unsupported file types
    return <div>This file type is not supported.</div>;
  }
};

export default DocViewer;
