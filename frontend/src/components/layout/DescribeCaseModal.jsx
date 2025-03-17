import { Button, Flex, Loader, Modal, Text, Textarea } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  initiateCaseRequest,
  submitCase,
} from "../../redux/actions/caseActions";
import custAxios, { attachToken } from "../../services/axiosConfig";
import { errorMessage } from "../../globalFunctions";
import { DataTable } from "mantine-datatable";

const DescribeCaseModal = ({
  opened,
  close,
  isChatInitiated = false,
  lawyerId = 0,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { loading } = useSelector((store) => store.case);
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  const { values, getInputProps } = useForm({
    initialValues: {
      case_description: "",
    },
    validateInputOnBlur: ["case_description"],
    validateInputOnChange: ["case_description"],
    validate: yupResolver(
      yup.object({
        case_description: yup
          .string()
          .required("Case description is required...!")
          .min(100, "Case description should be atleast 100 characters long")
          .max(1000, "Case description shouldn't be more than 1000 characters"),
      })
    ),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      submitCase({ case_description: values.case_description })
    );

    let chatRes;
    if (pathname.includes("/legal-professionals")) {
      chatRes = await dispatch(
        initiateCaseRequest(res?.data?.case?.id, lawyerId)
      );
      chatRes &&
        navigate(`/chat/${lawyerId}`, {
          state: { lawyer_id: lawyerId, userData: user?.userData },
        });

      return true;
    }

    !loading &&
      res?.success &&
      navigate("/legal-professionals", {
        state: {
          area_of_practice: res?.data?.area_of_practice,
          case: res?.data?.case,
        },
      });

    return true;
  };

  const [pendingCases, setPendingCases] = useState([]);
  const [hasPendingCases, setHasPendingCases] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchPendingCases = async () => {
    setIsLoading(true);
    try {
      attachToken();
      const res = await custAxios.get(`/client/pending-cases`);
      if (res?.data?.res === "success") {
        res.data.data.length > 0 && setHasPendingCases(true);
        setPendingCases(res.data.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isAuthenticated && opened && handleFetchPendingCases();
  }, [isAuthenticated, opened]);

  return (
    <>
      <Modal
        opened={opened}
        size={"xl"}
        onClose={close}
        title={
          !hasPendingCases
            ? "Describe your case:"
            : "Select a case to initiate this chat:"
        }
        centered
        sx={{
          section: {
            minHeight: "350px",
          },
        }}
      >
        {!pathname.includes("/legal-professionals") || !hasPendingCases ? (
          <form onSubmit={handleSubmit}>
            {!loading ? (
              <>
                {pendingCases.length > 0 && (
                  <Flex justify={"flex-end"}>
                    <Button
                      bg={"#db9753"}
                      sx={{
                        ":hover": {
                          background: "#db9728",
                        },
                      }}
                      mb={16}
                      onClick={() => setHasPendingCases(true)}
                      className="text-capitalize"
                    >
                      Select From Existing
                    </Button>
                  </Flex>
                )}

                <Textarea
                  placeholder="Describe your case and we'll get you lagal professionals with relevant practice areas"
                  autosize
                  withAsterisk
                  minRows={8}
                  maxRows={8}
                  {...getInputProps("case_description")}
                />

                <Flex justify={"flex-end"}>
                  <span>
                    <span
                      style={{
                        color:
                          values.case_description.length < 100 ||
                          values.case_description.length > 1000
                            ? "red"
                            : "unset",
                      }}
                    >
                      {values.case_description.length}
                    </span>
                    /1000
                  </span>
                </Flex>
              </>
            ) : (
              <Flex gap={10} mih={300} align={"center"}>
                <Loader color="#db9753" size={"xl"} />{" "}
                <span>
                  Your case description is being processed. we'll get you the
                  suitable legal professionals for your case.
                </span>
              </Flex>
            )}

            <Flex justify={"flex-end"} align={"center"} mt={20}>
              <Button
                type="submit"
                loading={loading}
                disabled={
                  values.case_description.length < 100 ||
                  values.case_description.length > 1000
                }
                sx={{
                  ":disabled": {
                    cursor: "not-allowed",
                    pointerEvents: "unset",
                    opacity: 1,
                    ":hover": {
                      color: "initial",
                      background: "#f9f9f9",
                    },
                  },
                }}
                className="primary-btn rounded-1"
              >
                Next
              </Button>
            </Flex>
          </form>
        ) : (
          !loading &&
          hasPendingCases && (
            <>
              <Flex justify={"flex-end"}>
                <Button
                  bg={"#db9753"}
                  sx={{
                    ":hover": {
                      background: "#db9728",
                    },
                  }}
                  mb={16}
                  onClick={() => setHasPendingCases(false)}
                  className="text-capitalize"
                >
                  Describe New Case
                </Button>
              </Flex>

              <PendingCasesTable
                lawyerId={lawyerId}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                pendingCases={pendingCases}
                isChatInitiated={isChatInitiated}
              />
            </>
          )
        )}
      </Modal>
    </>
  );
};

const PendingCasesTable = ({
  lawyerId,
  isLoading,
  setIsLoading,
  pendingCases,
  isChatInitiated,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.auth);

  const handleCaseRequest = async (caseId) => {
    setIsLoading(true);

    const res = await dispatch(initiateCaseRequest(caseId, lawyerId));
    res &&
      navigate(`/chat/${lawyerId}`, {
        state: { lawyer_id: lawyerId, userData: user?.userData },
      });
    res && setIsLoading(false);
  };

  const columns = [
    {
      accessor: "SNO.",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "case",
      width: "auto",
      title: "Case Description",
      render: (record) => <Text lineClamp={2}>{record?.case}</Text>,
    },
    {
      accessor: "case_summary",
      width: "auto",
      title: "Case Summary",
      render: (record) => <Text lineClamp={2}>{record?.case_summary}</Text>,
    },
    {
      accessor: "status",
      width: "auto",
      render: (record) => (
        <Text
          sx={{
            padding: "2px 4px",
            backgroundColor: "#32c349",
            borderRadius: "4px",
            color: "white",
          }}
        >
          {record?.status === 0 && "pending"}
        </Text>
      ),
    },
    {
      accessor: "Action",
      width: "auto",
      render: (record) => (
        <Text
          span
          onClick={() => handleCaseRequest(record?.id)}
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
            ":hover": {
              textDecoration: "none",
              color: "#db9753",
            },
          }}
        >
          Select
        </Text>
      ),
    },
  ];

  return !isLoading && pendingCases.length > 0 ? (
    <DataTable
      className="data-table-with-actions"
      withBorder
      records={pendingCases}
      withColumnBorders
      striped
      highlightOnHover
      verticalSpacing={10}
      columns={columns}
      minHeight={280}
      maxHeight={280}
      noRecordsText="No records found"
    />
  ) : isLoading ? (
    <Flex gap={10} justify={"center"} mih={300} align={"center"}>
      <Loader color="#db9753" size={"xl"} />{" "}
      <span>Loading availble cases for initiating a case request.</span>
    </Flex>
  ) : (
    !isLoading &&
    isChatInitiated && (
      <Flex gap={10} mih={300} align={"center"}>
        <span>
          No Cases available for initiating a case request. please submit a case
          first.
        </span>
      </Flex>
    )
  );
};

export default DescribeCaseModal;
