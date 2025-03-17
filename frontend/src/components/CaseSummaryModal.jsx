import React, { useState, useEffect } from "react";
import { Container, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { caseRequest } from "../redux/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { isAbleToChat } from "../redux/actions/clientActions";
import { Button, Flex, Loader } from "@mantine/core";

const CaseSummaryModal = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [caseSummary, setCaseSummary] = useState("");
  const [CaseData, setCaseData] = useState("");
  const [Loading, setLoading] = useState(true);
  const { loading } = useSelector((state) => state.chat);

  const CheckCaseAvaibility = async () => {
    dispatch(isAbleToChat(props?.lawyer_id)).then((res) => {
      setCaseData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    CheckCaseAvaibility();
  }, [props?.lawyer_id]);

  const handleNextOfCaseRequest = async () => {
    try {
      const res = await dispatch(
        caseRequest({ val: caseSummary, lawyer_id: props?.lawyer_id })
      );

      if (res.data.res === "success") {
        navigate(`/chat/${props?.lawyer_id}`, {
          state: { id: props?.lawyer_id, userData: props?.userData },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="case-type-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {Loading
            ? "Loading..."
            : CaseData?.res
            ? "Please Describe Your Case:"
            : "Your last case details:"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container fluid>
          <Form className="case-summary-form row">
            {!Loading ? (
              CaseData?.res ? (
                <FloatingLabel label="Case Summary" className="my-3">
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ minHeight: "200px" }}
                    onChange={(e) => setCaseSummary(e.target.value)}
                  />
                </FloatingLabel>
              ) : (
                <div>
                  <h5>
                    <strong>Original Case:</strong>
                  </h5>
                  <p>{CaseData?.data?.case?.case}</p>
                  <hr />
                  <h5>
                    <strong>Summarized Case:</strong>
                  </h5>
                  <p>{CaseData?.data?.case?.case_summary}</p>
                </div>
              )
            ) : (
              <Flex justify={"center"} align={"center"} mih={250}>
                <Loader color="#db9753" size={"xl"} />
              </Flex>
            )}
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {Loading ? (
          ""
        ) : CaseData?.res ? (
          <Button
            disabled={caseSummary.trim() === ""}
            className="primary-btn rounded-1"
            onClick={() => handleNextOfCaseRequest()}
            loading={loading}
          >
            Next
          </Button>
        ) : (
          <Button
            className="primary-btn rounded-1"
            onClick={() => {
              navigate(`/client/dashboard#case-${CaseData.data.id}`);
            }}
          >
            View Case
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CaseSummaryModal;
