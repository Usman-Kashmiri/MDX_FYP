import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import chatNowIcon from "../assets/images/chat-now-icon.png";
import { Card, Col } from "react-bootstrap";
import Ratings from "./Ratings";
import { useAuth } from "../hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure } from "@mantine/hooks";
import DescribeCaseModal from "./layout/DescribeCaseModal";
import { isAbleToChat } from "../redux/actions/clientActions";
import { Avatar, Button, Flex } from "@mantine/core";
import { errorMessage } from "../globalFunctions";

const LawyerCard = ({ lawyerDetails }) => {
  const isAuthorized = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChatInitiated, setIsChatInitiated] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isCaseModalOpened, { open: openCaseModal, close: closeCaseModal }] =
    useDisclosure(false);

  const { cases } = useSelector((store) => store.case);
  const { user } = useSelector((store) => store?.auth);

  useEffect(() => {
    const caseObject = cases?.find(
      (item) =>
        item?.lawyer?.id === lawyerDetails?.id &&
        item?.client?.id === user?.userData?.id
    );

    caseObject !== undefined && setIsChatInitiated(true);
  }, []);

  const handleChat = async () => {
    setIsChatLoading(true);
    !isAuthorized && navigate("/auth/login", { state: "/legal-professionals" });
    !isAuthorized && errorMessage("Please login first to initiate a case");
    const res = await dispatch(isAbleToChat(lawyerDetails?.id));
    isAuthorized && res.res && setIsChatInitiated(true);
    isAuthorized && !res.res && openCaseModal();
    isAuthorized &&
      res.res &&
      navigate(`/chat/${lawyerDetails?.id}`, {
        state: { lawyer_id: lawyerDetails.id, userData: user?.userData },
      });
    setIsChatLoading(false);
  };

  return (
    <Col className="lawyer-card" xl={3} sm={5} xs={10}>
      <Card className="w-100 h-100 rounded-0 shadow border-0">
        <div className="px-4 py-4 lawyer-card-top d-flex flex-column align-items-center gap-3">
          <div className="card-image rounded-circle">
            <Link to={`/lawyer/${lawyerDetails?.id}`}>
              <Avatar
                size={130}
                radius={500}
                variant="top"
                src={lawyerDetails?.image}
              />
            </Link>
          </div>
          <Link to={`/lawyer/${lawyerDetails?.id}`}>
            <span className="text-uppercase font-montserrat bg-white fw-semibold p-2 w-auto text-center rounded shadow lawyer-name">
              {`${lawyerDetails?.first_name} ${lawyerDetails?.last_name}`}
            </span>
          </Link>
        </div>
        <Card.Body>
          <Link to={`/lawyer/${lawyerDetails?.id}`}>
            <div className="ratings d-flex flex-column align-items-center px-4 py-3 rounded-3">
              <Ratings ratings={Math.round(lawyerDetails?.ratings)} />
              <span className="rating-count font-poppins text-center">
                Based on {lawyerDetails?.reviews?.length} Reviews
              </span>
            </div>
          </Link>

          <div className="lawyer-card-bottom pt-2 d-flex justify-content-between mt-3">
            <span className="card-logo">
              <img src={logo} alt="logo" className="w-100" />
            </span>
            <Button
              onClick={handleChat}
              isChatInitiated
              loading={isChatLoading}
              disabled={isChatLoading}
              className="chat-now-btn text-white gap-2 text-uppercase"
            >
              <Flex align={"center"} justify={"center"} gap={6}>
                {isChatInitiated ? "Chat" : "Initiate Case"}
                <img src={chatNowIcon} alt="chat-now" />
              </Flex>
            </Button>
          </div>
        </Card.Body>
      </Card>

      <DescribeCaseModal
        opened={isCaseModalOpened}
        close={closeCaseModal}
        isChatInitiated={isChatInitiated}
        lawyerId={lawyerDetails.id}
      />
    </Col>
  );
};

export default LawyerCard;
