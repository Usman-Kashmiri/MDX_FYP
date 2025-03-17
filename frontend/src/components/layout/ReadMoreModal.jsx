import { Modal, ScrollArea } from "@mantine/core";
import React from "react";

const ReadMoreModal = ({ isOpen, isClosed, modalTittle, content }) => {
  return (
    <Modal
      opened={isOpen}
      onClose={isClosed}
      title={modalTittle}
      size="md"
      centered
      scrollAreaComponent={ScrollArea.Autosize}
      className="read-more-modal-content"
      zIndex={10000}
    >
      {typeof content === "string" ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        content
      )}
    </Modal>
  );
};

export default ReadMoreModal;
