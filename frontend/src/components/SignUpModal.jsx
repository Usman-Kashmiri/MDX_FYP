import React from "react";
import { Modal, ScrollArea } from "@mantine/core";

const SignUpModal = ({ isOpen, isClosed, modalTittle, content }) => {
  return (
    <Modal
      opened={isOpen}
      onClose={isClosed}
      title={modalTittle}
      size="auto"
      centered
      scrollAreaComponent={ScrollArea.Autosize}
      className="signup-modal-content"
    >
      {typeof(content) === 'string' ? 
      <div dangerouslySetInnerHTML={{ __html: content }} />
    : 
    content}
    </Modal>
  );
};

export default SignUpModal;
