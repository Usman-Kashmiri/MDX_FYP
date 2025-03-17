import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { contractById, requestContract } from "../redux/actions/lawyerAction";
import dayjs from "dayjs";
import {
  Anchor,
  AspectRatio,
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Rating,
  SimpleGrid,
  Table,
  Text,
  Textarea,
} from "@mantine/core";
import { Spinner } from "react-bootstrap";
import {
  acceptContract,
  contractByIdForClient,
  paymentOfContract,
} from "../redux/actions/clientActions";
import { Modal } from "@mantine/core";
import { SlCalender } from "react-icons/sl";
import { contractByIdForAdmin } from "../redux/actions/adminActions";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/payment/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { attachTokenWithFormAxios, formAxios } from "../services/axiosConfig";
import { errorMessage, successMessage } from "../globalFunctions";
import ViewMilestone from "./ViewMilestone";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Video from "yet-another-react-lightbox/plugins/video";
import PDFImage from "../assets/images/chat/extensions/pdf.png";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import ImageFile from '../assets/images/chat/extensions/image.png';
import { IoMdDownload } from "react-icons/io";

const ContractDetails = () => {
  const location = useLocation();
  const role = JSON.parse(localStorage.getItem("user")).role;
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contractList, loading } = useSelector((state) => state?.lawyer);
  const thumbnailsRef = useRef(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const { id } = useParams();

  const [response, setResponse] = useState(""); // Start with an empty string
  const { payment } = useSelector((state) => state?.client);

  const updateContractStatus = useCallback(
    async (paymentIntent, paymentIntentClientSecret, redirectStatus) => {
      try {
        const fd = new FormData();
        fd.append("paymentIntent", paymentIntent);
        fd.append("paymentIntentClientSecret", paymentIntentClientSecret);
        fd.append("redirectStatus", redirectStatus);
        fd.append("contract_id", id);

        await dispatch(acceptContract(fd));
        dispatch(contractByIdForClient(id));
        navigate(`/dashboard/contract-details/${id}`);
      } catch (error) {
        console.error(error.message);
      }
    },
    [dispatch, id, navigate]
  );

  useEffect(() => {
    if (role === "Lawyer") {
      dispatch(contractById(id));
    } else if (role === "Client") {
      dispatch(contractByIdForClient(id));
    } else if (role === "SuperAdmin") {
      dispatch(contractByIdForAdmin(id));
    }

    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("payment_intent")) {
      updateContractStatus(
        searchParams.get("payment_intent"),
        searchParams.get("payment_intent_client_secret"),
        searchParams.get("redirect_status")
      );
    }
  }, [id, dispatch, location.search, role, updateContractStatus]);

  const PaymentForm = async () => {
    dispatch(paymentOfContract({ contract_id: id }));
  };

  const completeRequest = async () => {
    await dispatch(requestContract(id));
    if (role === "Lawyer") {
      dispatch(contractById(id));
    } else if (role === "Client") {
      dispatch(contractByIdForClient(id));
    } else if (role === "SuperAdmin") {
      dispatch(contractByIdForAdmin(id));
    }
  };

  useEffect(() => {
    if (payment?.client_secret) {
      setResponse(payment.client_secret);
    }
  }, [payment]);

  const stripePromise = loadStripe(
    "pk_test_51LNwdwEhtGsvhu7H9TkyLlTgcztHPnXfhXp1yKSad6bjoM9fsP3dyRyuuB8rhmQAKkjeZa4iC8rgo6WxLWAvlEfL00UuPXV5L9"
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => {
    setModalOpen(!isModalOpen);
  };

  const [isLoadting, setIsLoadting] = useState(false);
  const SubmitContract = async (e) => {
    e.preventDefault();
    setIsLoadting(true);
    try {
      if (feedback.trim() === "" || rating === 0) {
        return;
      }

      const fd = new FormData();
      fd.append("rating", rating);
      fd.append("feedback", feedback);
      fd.append("contract_id", id);
      attachTokenWithFormAxios();
      let resp = await formAxios.post("client/contracts/complete-contract", fd);
      if (resp?.data?.res === "success") {
        successMessage(resp?.data?.message);
        dispatch(contractByIdForClient(id));
        handleOpenModal();
      } else {
        errorMessage(resp?.data?.message);
      }
    } catch (err) { }
    setIsLoadting(false);
  };

  const [videoSlides, setVideoSlides] = useState([]);
  const [imageSlides, setImageSlides] = useState([]);

  const handleOpenVideoLightbox = () => {
    setIsLightboxOpen(true);
    setActiveSlideIndex(0);
  };

  const handleOpenImageLightbox = () => {
    setIsLightboxOpen(true);
    setActiveSlideIndex(0);
  };

  const handleItemClick = (item, index) => {
    setActiveSlideIndex(index);
    if (item.mime_type.includes("video")) {
      setVideoSlides(
        contractList?.documents.filter((item) =>
          item.mime_type.includes("video")
        )
      );
      handleOpenVideoLightbox();
    } else if (item.mime_type.includes("image")) {
      setImageSlides(
        contractList?.documents.filter((item) =>
          item.mime_type.includes("image")
        )
      );
      handleOpenImageLightbox();
    }
  };

  return (
    <div>
      {loading ? (
        <div
          style={{ height: "80vh" }}
          className="d-flex justify-content-center align-items-center pt-4"
        >
          <Spinner animation="border" />
        </div>
      ) : contractList ? (
        <div className="contract-detail-container">
          <div className="start-and-end-date-header">
            <span className="date-span d-flex flex-row justify-content-around  gap-2 align-items-center">
              <SlCalender
                style={{
                  color: "#eaa954",
                }}
              />
              <span className="span-value-of-contract-detail">
                <strong>Start: </strong>
                {dayjs(contractList?.start_date).format("YYYY-MM-DD")}
              </span>
            </span>
          </div>
          <div className="contract-detail-body pb-4">
            {(role === "Lawyer" || role === "Client") && (
              <Flex
                wrap={"wrap"}
                gap={15}
                className="client-detail-in-contract-detail"
              >
                <Flex gap={12} align={"center"} wrap={"wrap"} justify="center">
                  <Avatar
                    src={
                      role === "Lawyer"
                        ? contractList?.client?.profile
                        : contractList?.lawyer?.profile
                    }
                    alt={
                      role === "Lawyer"
                        ? contractList?.client?.first_name
                        : contractList?.lawyer?.first_name + " profile pic"
                    }
                    size={120}
                    radius={200}
                  />
                  <div className="ml-5 d-flex flex-column justify-content-center ">
                    <Text
                      sx={{
                        fontSize: "1.75rem",
                        fontWeight: "bold",
                        "@media screen and (max-width: 576px)": {
                          fontSize: "1rem",
                        },
                      }}
                    >{`${role === "Lawyer"
                      ? contractList?.client?.first_name
                      : contractList?.lawyer?.first_name
                      } ${role === "Lawyer"
                        ? contractList?.client?.last_name
                        : contractList?.lawyer?.last_name
                      }`}</Text>
                    <Text
                      sx={{
                        fontSize: "1rem",
                        "@media screen and (max-width: 576px)": {
                          fontSize: "0.8rem",
                        },
                      }}
                    >{`${role === "Lawyer"
                      ? contractList?.client?.email
                      : contractList?.lawyer?.email
                      }`}</Text>
                  </div>
                </Flex>
                <div className="right-side">
                  <Link
                    to={`/chat/${role === "Lawyer"
                      ? contractList?.client?.id
                      : contractList?.lawyer?.id
                      }`}
                  >
                    <button className="primary-btn w-100 text-capitalize">
                      chat
                    </button>
                  </Link>
                </div>
              </Flex>
            )}
            {(contractList?.title || contractList?.contract_title) && (
              <div>
                <h2>Contract Title:</h2>
                <p>
                  {role === "SuperAdmin"
                    ? contractList?.contract_title
                    : contractList?.title}
                </p>
              </div>
            )}
            {contractList?.clauses && (
              <div>
                <h2>Contract Clauses:</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: contractList?.clauses }}
                />
              </div>
            )}
            {contractList?.additional_note !== "<p></p>" && (
              <div>
                <h2>Additional Notes:</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: contractList?.additional_note,
                  }}
                />
              </div>
            )}
            {contractList?.documents?.length > 0 && (
              <div className="w-100">
                <h2>Supporting Documents:</h2>
                <Flex
                  gap={"10px"}
                  mt={'30px'}
                  wrap={"wrap"}>
                  {contractList?.documents?.map((file, index) => {
                    return (

                      <Box
                        title={file.file_name}
                        sx={{
                          width: "fit-content",
                          background: "aliceblue",
                          height: "70px",
                          padding: "10px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "row",
                          alignItems: "center",
                          border: '1px solid #eeddc8',
                          borderRadius: '5px',
                          cursor: "pointer",
                          ":hover": {
                            backgroundColor: "#00000029",
                            ".close-btn": {
                              opacity: 1,
                            },
                          },
                        }}
                        key={index}
                      >

                        {file?.mime_type.includes("pdf") ? (

                          <Image
                            src={PDFImage}
                            style={{
                              width: "40px",
                              objectFit: "cover",
                              height: "fit-content",
                            }}
                            alt={file?.file_name}
                          />


                        ) : file?.mime_type.includes("video") ? (
                          <video
                            onClick={() => handleItemClick(file, index)}
                            src={file?.src}
                            alt={file?.file_name}
                            style={{
                              width: "40px",
                              objectFit: "cover",
                              height: "fit-content",
                            }}
                            controls
                          />
                        ) : file?.mime_type.includes("audio") ? (
                          <audio
                            onClick={() => handleItemClick(file, index)}
                            src={file?.src}
                            alt={file?.file_name}
                            style={{
                              width: "40px",
                              objectFit: "cover",
                              height: "fit-content",
                            }}
                            controls
                          />
                        ) : (
                          <Image
                            style={{
                              width: "40px",
                              objectFit: "cover",
                              height: "fit-content",
                            }}
                            onClick={() => handleItemClick(file, index)}
                            src={ImageFile}
                            alt={file?.file_name}
                          />
                        )}
                        <Text
                          truncate="end"
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            width: "100%",
                            padding: "0 5px",
                          }}
                          size="sm"
                          lineClamp={1}
                        >
                          {file.file_name.length > 15
                            ? (() => {
                              let filename = file.file_name;
                              let res = filename.slice(
                                filename.length / 2 - filename.length / 3,
                                filename.length / 2 + filename.length / 3
                              );
                              let newRes = filename.replace(res, ".....");
                              return newRes;
                            })()
                            : file.file_name}
                        </Text>

                        <Anchor
                          sx={{ fontSize: '14px' }}
                          href={file?.src}
                          download="attachment" target="_blank" >
                          download
                        </Anchor>


                      </Box>
                    );
                  })}
                </Flex>

                <Lightbox
                  open={isLightboxOpen}
                  close={() => setIsLightboxOpen(false)}
                  index={activeSlideIndex}
                  thumbnails={{ ref: thumbnailsRef }}
                  slides={
                    videoSlides.length > 0
                      ? videoSlides.map((item) => {
                        return {
                          type: "video",
                          width: "80%",
                          height: "80%",
                          poster: false,
                          sources: [{ src: item.src, type: item.mime_type }],
                        };
                      })
                      : imageSlides.map((item) => {
                        return { type: "image", src: item.src };
                      })
                  }
                  on={{
                    click: () => {
                      (thumbnailsRef.current?.visible
                        ? thumbnailsRef.current?.hide
                        : thumbnailsRef.current?.show)?.();
                    },
                  }}
                  plugins={[Download, Video, Thumbnails]}
                />
              </div>
            )}

            <div
              style={{
                width: "100%",
              }}
            >
              <h1
                style={{
                  width: "100%",
                  textAlign: "center",
                  borderBottom: "1px solid gray",
                }}
                className="mb-3 pb-3"
              >
                Details
              </h1>
              <Table className="mb-5">
                <tbody>
                  {role !== "Client" && (
                    <tr>
                      <td>
                        <strong>Client Name</strong>
                      </td>
                      <td align="end">
                        {contractList?.client?.first_name}{" "}
                        {contractList?.client?.last_name}
                      </td>
                    </tr>
                  )}
                  {role !== "Client" && (
                    <tr>
                      <td>
                        <strong>Client Email</strong>
                      </td>
                      <td align="end">{contractList?.client?.email}</td>
                    </tr>
                  )}
                  {role !== "Lawyer" && (
                    <tr>
                      <td>
                        <strong>Lawyer Name</strong>
                      </td>
                      <td align="end">
                        {contractList?.lawyer?.first_name}{" "}
                        {contractList?.lawyer?.last_name}
                      </td>
                    </tr>
                  )}
                  {role !== "Lawyer" && (
                    <tr>
                      <td>
                        <strong>Lawyer Email</strong>
                      </td>
                      <td align="end">{`${contractList?.lawyer?.email}`}</td>
                    </tr>
                  )}
                  <tr>
                    <td>
                      <strong>Contract Title</strong>
                    </td>
                    <td align="end">
                      {role === "SuperAdmin"
                        ? contractList?.contract_title
                        : contractList?.title}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Contract Type</strong>
                    </td>
                    <td align="end">
                      {role === "SuperAdmin"
                        ? contractList?.contract_type
                        : contractList?.type}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Fees Amount</strong>
                    </td>
                    <td
                      align="end"
                      style={{ color: "#dc9840", fontWeight: "800" }}
                    >
                      {contractList?.fees_amount}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Start Date</strong>
                    </td>
                    <td align="end">
                      {dayjs(contractList?.start_date).format(
                        "YYYY MMM, dddd DD"
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            {role === "Lawyer" &&
              contractList.lawyer_complete_request === 0 && (
                <>
                  <Button
                    className="primary-btn w-100 mt-4 text-capitalize"
                    sx={{
                      height: "45px",
                    }}
                    onClick={() => completeRequest()}
                  >
                    Send a Contract Completion Request
                  </Button>
                </>
              )}
            {role === "Client" &&
              !response &&
              contractList.status === "pending" && (
                <div className="d-flex flex-row w-100 mb-2 position-sticky top-0 ">
                  <Button
                    className="primary-btn w-100 mt-4 text-capitalize"
                    onClick={() => PaymentForm()}
                  >
                    Approve this contract
                  </Button>
                </div>
              )}
            {role === "Client" &&
              contractList.lawyer_complete_request === 1 &&
              contractList.status === "in-progress" && (
                <div className="d-flex flex-row w-100 mb-2 position-sticky top-0 ">
                  <Button
                    className="primary-btn w-100 mt-4 text-capitalize"
                    onClick={handleOpenModal}
                  >
                    Complete this Contract
                  </Button>
                </div>
              )}
            {response && stripePromise && (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret: response }}
              >
                <CheckoutForm
                  clientSecret={response}
                  contractDetails={contractList}
                  contract_id={id}
                />
              </Elements>
            )}

            {/* {contractList.status !== "pending" && ( */}
            <>
              <ViewMilestone contractId={id} />
            </>
            {/* )} */}
            <Modal
              opened={isModalOpen}
              onClose={handleOpenModal}
              title={<h4 className="text-center">Complete Contract</h4>}
              centered
            >
              <form onSubmit={SubmitContract}>
                <label className="ms-3">
                  Ratings
                  <Rating
                    value={rating}
                    size="lg"
                    onChange={setRating}
                    label="Ratings"
                  />
                </label>

                <Textarea
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-100 p-3 "
                  placeholder="Enter Feedback ...."
                  label="Your comment"
                  withAsterisk
                />
                <Button
                  disabled={isLoadting}
                  type="submit"
                  className="primary-btn w-100 mt-4 text-capitalize"
                >
                  Complete Contract
                </Button>
              </form>
              {/* Modal content */}
            </Modal>
          </div>
        </div>
      ) : (
        <div>Not Found</div>
      )}
    </div>
  );
};

export default ContractDetails;
