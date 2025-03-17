import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStatistics } from "../../redux/actions/adminActions";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Avatar, Chip, Image, Text } from "@mantine/core";
import dayjs from "dayjs";
import { DataTable } from "mantine-datatable";
import { AiOutlineEye } from "react-icons/ai";

const UserStatistics = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userStatistics } = useSelector((state) => state?.admin);
  const [userData, setUserData] = useState({});
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  console.log(userStatistics);
  useEffect(() => {
    dispatch(fetchUserStatistics(id));
  }, [dispatch, id]);

  useEffect(() => {
    setUserData(userStatistics);
  }, [userStatistics]);

  return (
    <div className="mt-4 pb-md-5 pb-0 mb-md-5 px-md-4 px-3 min-vh-50">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h2 className="mt-0  mb-0">UserStatistics</h2>
      </div>
      <div>
        <UserSimpleDetails userData={userData} />
      </div>
      {role == "superadmin" && (
        <div>
          {userData?.appointments?.length > 0 && (
            <div className="mt-4">
              <AppointmentTable userData={userData?.appointments} />
            </div>
          )}
          {userData?.contracts?.length > 0 && (
            <div className="mt-4">
              <ContractsTable userData={userData?.contracts} />
            </div>
          )}
          {userData?.reviews?.length > 0 && (
            <div className="mt-4">
              <ReviewsTable userData={userData?.reviews} />
            </div>
          )}
          {userData?.transactions_history?.length > 0 && (
            <div className="mt-4">
              <TransactionHistoryTable
                userData={userData?.transactions_history}
              />
            </div>
          )}
          {userData?.withdraw_requests?.length > 0 && (
            <div className="mt-4">
              <WithDrawRequestTable userData={userData?.withdraw_requests} />
            </div>
          )}
          {userData?.cases?.length > 0 && (
            <div className="mt-4">
              <CasesTable userData={userData?.cases} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserStatistics;

const UserSimpleDetails = ({ userData }) => {
  return (
    <>
      <div
        className="mt-4 manage-profile-form mx-md-4 mx-3"
        style={{
          boxShadow:
            "-7px -7px 15px #d7d7d763, 7px 7px 15px #e9e9e9 !important",
        }}
      >
        <Row>
          <Col xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Profile Image</span>
            <span className="value-of-user-in-user-statistics">
              {userData?.image ? (
                <Avatar
                  src={userData?.image}
                  alt="User Profile"
                  style={{
                    borderRadius: "50%",
                    border: "none",
                    width: "150px",
                    height: "150px",
                    aspectRatio: "1",
                  }}
                  // withPlaceholder
                  className=" object-fit-contain"
                />
              ) : (
                "N/A"
              )}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">First Name</span>
            <span className="value-of-user-in-user-statistics">
              {userData?.first_name || "N/A"}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Last Name</span>
            <span className="value-of-user-in-user-statistics">
              {userData?.last_name || "N/A"}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Email</span>
            <span className="value-of-user-in-user-statistics">
              {userData?.email || "N/A"}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Email Status</span>
            <span className="value-of-user-in-user-statistics">
              {userData?.email_verification_status || "N/A"}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Phone</span>
            <span className="value-of-user-in-user-statistics">
              {userData?.phone_number || "N/A"}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">IBAN</span>
            <span className="value-of-user-in-user-statistics ">
              {userData?.iban || "N/A"}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Ratings</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.ratings?.toFixed(1) || "N/A"}`}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">
              Areas of exterpertise
            </span>
            <div className="d-flex gap-2 flex-wrap mt-2">
              <Chip.Group>
                {userData?.area_expertise?.length > 0 ? (
                  userData?.area_expertise?.map((practice, i) => {
                    return (
                      <Chip value={practice?.id} checked key={i}>
                        {practice?.name}
                      </Chip>
                    );
                  })
                ) : (
                  <p className="mb-0 ms-3">N/A</p>
                )}
              </Chip.Group>
            </div>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Jurisdiction</span>
            <div className="d-flex gap-2 flex-wrap mt-2">
              <Chip.Group>
                {userData?.jurisdictions?.length > 0 ? (
                  userData?.jurisdictions?.map((practice, i) => {
                    return (
                      <Chip value={practice?.id} checked key={i}>
                        {practice?.name}
                      </Chip>
                    );
                  })
                ) : (
                  <p className="mb-0 ms-3">N/A</p>
                )}
              </Chip.Group>
            </div>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Date of Birth</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.dob || "N/A"}`}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Country</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.country?.name || "N/A"}`}
            </span>
          </Col>
          {/* <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Jurisdiction</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.jurisdiction?.name || "N/A"}`}
            </span>
          </Col> */}
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">State</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.state?.name || "N/A"}`}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">
              Bar Membership Number
            </span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.bar_membership_number || "N/A"}`}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Status</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.status === "1" ? "Active" : "Inactive"}`}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Zip Code</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.zip_code || "N/A"}`}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">City</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.city || "N/A"}`}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Amount</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.balance || "N/A"}`}
            </span>
          </Col>
          <Col sm={6} xs={12} className="d-flex flex-column mt-3">
            <span className="span-label-of-user-statistics">Address</span>
            <span className="value-of-user-in-user-statistics">
              {`${userData?.address || "N/A"}`}
            </span>
          </Col>
        </Row>
      </div>
    </>
  );
};

const AppointmentTable = ({ userData = [] }) => {
  const { loading } = useSelector((state) => state?.admin);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataForTable, setDataForTable] = useState([]);
  const [records, setRecords] = useState(dataForTable?.slice(0, PAGE_SIZE));

  useEffect(() => {
    setDataForTable(userData);
    setTotalRecords(userData?.length);
  }, [userData]);

  useEffect(() => {
    const from = page - 1;
    const to = from + PAGE_SIZE;
    setRecords(dataForTable?.slice(from, to));
  }, [page, dataForTable]);

  const appointmentColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "title",
      title: <Text>Title</Text>,
      width: "auto",
    },
    {
      accessor: "appointment_date",
      title: <Text>Appointment Date</Text>,
      width: "auto",
    },
    {
      accessor: "client.first_name",
      title: <Text>Client Name</Text>,
      width: "auto",
      render: (record) =>
        `${record?.client?.first_name} ${record?.client?.last_name}`,
    },
    {
      accessor: "status_text",
      title: <Text>Status</Text>,
      width: "auto",
    },
  ];

  return (
    <div>
      <div>
        <h2>Appointments</h2>
      </div>
      <DataTable
        className="data-table-with-actions mt-4"
        withBorder
        records={records || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={appointmentColumn}
        totalRecords={totalRecords}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => {
          setPage(p);
        }}
        fetching={loading}
        minHeight={300}
        loaderVariant="dots"
        noRecordsText="No records found"
        paginationText={({ from, to, totalRecords }) =>
          `Records ${from} - ${to} of ${totalRecords}`
        }
        paginationSize="md"
      />
    </div>
  );
};

const ContractsTable = ({ userData = [] }) => {
  const { loading } = useSelector((state) => state?.admin);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataForTable, setDataForTable] = useState([]);
  const [records, setRecords] = useState(dataForTable?.slice(0, PAGE_SIZE));
  const navigate = useNavigate();

  useEffect(() => {
    setDataForTable(userData);
    setTotalRecords(userData?.length);
  }, [userData]);
  // console.log(records);
  useEffect(() => {
    const from = page - 1;
    const to = from + PAGE_SIZE;
    setRecords(dataForTable?.slice(from, to));
  }, [page, dataForTable]);

  const appointmentColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "title",
      title: <Text>Title</Text>,
      width: "auto",
      render: (record) => {
        return (
          <Text
            onClick={() => {
              navigate(`/dashboard/contract-details/${record?.id}`);
            }}
            style={{
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {record?.title}
          </Text>
        );
      },
    },
    {
      accessor: "type",
      title: <Text>Contract Type</Text>,
      width: "auto",
    },
    {
      accessor: "currency",
      title: <Text>Currecny</Text>,
      width: "auto",
    },
    {
      accessor: "fees_amount",
      title: <Text>Fee Amount</Text>,
      width: "auto",
    },
    {
      accessor: "client.first_name",
      title: <Text>Client Name</Text>,
      width: "auto",
      render: (record) =>
        `${record?.client?.first_name} ${record?.client?.last_name}`,
    },
    {
      accessor: "status",
      title: <Text>Status</Text>,
      width: "auto",
    },
    // {
    //   accessor: "additional_note",
    //   title: <Text>Additional Note</Text>,
    //   width: "auto",
    //   render: (record) => {
    //     const maxLength = 50; // Maximum length of text you want to show
    //     const note = record?.additional_note;

    //     if (note?.length > maxLength) {
    //       return (
    //         (
    //           <div
    //             dangerouslySetInnerHTML={{ __html: note.slice(0, maxLength) }}
    //           />
    //         ) + "..."
    //       );
    //     } else {
    //       return <div dangerouslySetInnerHTML={{ __html: note }} />;
    //     }
    //   },
    // },
    // {
    //   accessor: "clauses",
    //   title: <Text>Clauses</Text>,
    //   width: "auto",
    //   render: (record) => {
    //     const maxLength = 50; // Maximum length of text you want to show
    //     const note = record?.clauses;

    //     if (note?.length > maxLength) {
    //       return (
    //         (
    //           <div
    //             dangerouslySetInnerHTML={{ __html: note?.slice(0, maxLength) }}
    //           />
    //         ) + "..."
    //       );
    //     } else {
    //       return <div dangerouslySetInnerHTML={{ __html: note }} />;
    //     }
    //   },
    // },
    {
      accessor: "id",
      title: <Text>See Detail</Text>,
      width: "auto",
      render: (record) => (
        <Text
          onClick={() => {
            navigate(`/dashboard/contract-details/${record?.id}`);
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "22px",
            flexDirection: "row",
          }}
        >
          <AiOutlineEye />
        </Text>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h2>Contracts</h2>
      </div>
      <DataTable
        className="data-table-with-actions mt-4"
        withBorder
        records={records || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={appointmentColumn}
        totalRecords={totalRecords}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => {
          setPage(p);
        }}
        fetching={loading}
        minHeight={300}
        loaderVariant="dots"
        noRecordsText="No records found"
        paginationText={({ from, to, totalRecords }) =>
          `Records ${from} - ${to} of ${totalRecords}`
        }
        paginationSize="md"
      />
    </div>
  );
};

const ReviewsTable = ({ userData = [] }) => {
  const { loading } = useSelector((state) => state?.admin);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataForTable, setDataForTable] = useState([]);
  const [records, setRecords] = useState(dataForTable?.slice(0, PAGE_SIZE));

  useEffect(() => {
    setDataForTable(userData);
    setTotalRecords(userData?.length);
  }, [userData]);
  useEffect(() => {
    const from = page - 1;
    const to = from + PAGE_SIZE;
    setRecords(dataForTable?.slice(from, to));
  }, [page, dataForTable]);
  const appointmentColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },

    {
      accessor: "rating",
      title: <Text>Ratings</Text>,
      width: "auto",
      render: (record) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${record?.rating}/5`}
          {""}
        </div>
      ),
    },
    {
      accessor: "client.first_name",
      title: <Text>Client Name</Text>,
      width: "auto",
      render: (record) =>
        `${record?.client?.first_name} ${record?.client?.last_name}`,
    },
    {
      accessor: "feedback",
      title: <Text>FeedBack</Text>,
      width: "auto",
      render: (record) => {
        const maxLength = 50; // Maximum length of text you want to show
        const note = record?.feedback;

        if (note?.length > maxLength) {
          return <div title={note}>{note?.slice(0, maxLength)}...</div>;
        } else {
          return <div>{note}</div>;
        }
      },
    },
    {
      accessor: "created_at",
      title: <Text>Review Time</Text>,
      width: "auto",
      render: (record, i) => (
        <Text>{dayjs(record?.created_at).format("YYYY-MM-DD HH:MM")}</Text>
      ),
    },
  ];
  return (
    <div>
      <div>
        <h2>Reviews</h2>
      </div>
      <DataTable
        className="data-table-with-actions mt-4"
        withBorder
        records={records || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={appointmentColumn}
        totalRecords={totalRecords}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => {
          setPage(p);
        }}
        fetching={loading}
        minHeight={300}
        loaderVariant="dots"
        noRecordsText="No records found"
        paginationText={({ from, to, totalRecords }) =>
          `Records ${from} - ${to} of ${totalRecords}`
        }
        paginationSize="md"
      />
    </div>
  );
};

const TransactionHistoryTable = ({ userData = [] }) => {
  const { loading } = useSelector((state) => state?.admin);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataForTable, setDataForTable] = useState([]);
  const [records, setRecords] = useState(dataForTable?.slice(0, PAGE_SIZE));

  useEffect(() => {
    setDataForTable(userData);
    setTotalRecords(userData?.length);
  }, [userData]);

  useEffect(() => {
    const from = page - 1;
    const to = from + PAGE_SIZE;
    setRecords(dataForTable?.slice(from, to));
  }, [page, dataForTable]);

  const transactionsColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "amount",
      title: <Text>Amount</Text>,
      width: "auto",
    },
    {
      accessor: "reason",
      width: "auto",
      title: <Text>Case Reason</Text>,
      render: (record) => {
        const maxLength = 50; // Maximum length of text you want to show
        const note = record?.reason;

        if (note?.length > maxLength) {
          return <div title={note}>{note.slice(0, maxLength)}...</div>;
        } else {
          return <div>{note}</div>;
        }
      },
    },
    {
      accessor: "type",
      title: <Text>Transaction Type</Text>,
      width: "auto",
      render: (record) => (
        <Text
          style={{
            textTransform: "capitalize",
            color: record?.type === "debited" ? "green" : "red",
          }}
        >
          {record?.type}
        </Text>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h2>Transactions </h2>
      </div>
      <DataTable
        className="data-table-with-actions mt-4"
        withBorder
        records={records || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={transactionsColumn}
        totalRecords={totalRecords}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => {
          setPage(p);
        }}
        fetching={loading}
        minHeight={300}
        loaderVariant="dots"
        noRecordsText="No records found"
        paginationText={({ from, to, totalRecords }) =>
          `Records ${from} - ${to} of ${totalRecords}`
        }
        paginationSize="md"
      />
    </div>
  );
};

const WithDrawRequestTable = ({ userData = [] }) => {
  const { loading } = useSelector((state) => state?.admin);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataForTable, setDataForTable] = useState([]);
  const [records, setRecords] = useState(dataForTable?.slice(0, PAGE_SIZE));

  useEffect(() => {
    setDataForTable(userData);
    setTotalRecords(userData?.length);
  }, [userData]);
  useEffect(() => {
    const from = page - 1;
    const to = from + PAGE_SIZE;
    setRecords(dataForTable?.slice(from, to));
  }, [page, dataForTable]);

  const requestColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "amount",
      title: <Text>Ammount</Text>,
      width: "auto",
    },
    {
      accessor: "iban",
      width: "auto",
      title: <Text>IBAN</Text>,
    },
    {
      accessor: "status",
      title: <Text>Status</Text>,
      width: "auto",
      render: (record) => <>{record?.status}</>,
    },
  ];
  return (
    <div>
      <div>
        <h2>WithDraw </h2>
      </div>
      <DataTable
        className="data-table-with-actions mt-4"
        withBorder
        records={records || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={requestColumn}
        totalRecords={totalRecords}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => {
          setPage(p);
        }}
        fetching={loading}
        minHeight={300}
        loaderVariant="dots"
        noRecordsText="No records found"
        paginationText={({ from, to, totalRecords }) =>
          `Records ${from} - ${to} of ${totalRecords}`
        }
        paginationSize="md"
      />
    </div>
  );
};

const CasesTable = ({ userData = [] }) => {
  const { loading } = useSelector((state) => state?.admin);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataForTable, setDataForTable] = useState([]);
  const [records, setRecords] = useState(dataForTable?.slice(0, PAGE_SIZE));

  useEffect(() => {
    setDataForTable(userData);
    setTotalRecords(userData?.length);
  }, [userData]);
  useEffect(() => {
    const from = page - 1;
    const to = from + PAGE_SIZE;
    setRecords(dataForTable?.slice(from, to));
  }, [page, dataForTable]);

  const casesColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "case",
      title: <Text>Case</Text>,
      width: "auto",
      render: (record) => {
        const maxLength = 50; // Maximum length of text you want to show
        const note = record?.case?.case;

        if (note?.length > maxLength) {
          return <div title={note}>{note?.slice(0, maxLength)}...</div>;
        } else {
          return <div>{note}</div>;
        }
      },
    },
    {
      accessor: "case_summary",
      width: "auto",
      title: <Text>Case Summary</Text>,
      render: (record) => {
        const maxLength = 50; // Maximum length of text you want to show
        const note = record?.case?.case_summary;

        if (note?.length > maxLength) {
          return <div title={note}>{note?.slice(0, maxLength)}...</div>;
        } else {
          return <div>{note}</div>;
        }
      },
    },
    {
      accessor: "client.first_name",
      title: <Text>Client Name</Text>,
      width: "auto",
      render: (record) =>
        `${record?.client?.first_name} ${record?.client?.last_name}`,
    },
    {
      accessor: "status_text",
      title: <Text>Status</Text>,
      width: "auto",
      render: (record) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textTransform: "capitalize",
          }}
        >
          {record?.status_text}
          {""}
        </div>
      ),
    },
  ];
  return (
    <div>
      <div>
        <h2>Cases </h2>
      </div>
      <DataTable
        className="data-table-with-actions mt-4"
        withBorder
        records={records || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={casesColumn}
        totalRecords={totalRecords}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => {
          setPage(p);
        }}
        fetching={loading}
        minHeight={300}
        loaderVariant="dots"
        noRecordsText="No records found"
        paginationText={({ from, to, totalRecords }) =>
          `Records ${from} - ${to} of ${totalRecords}`
        }
        paginationSize="md"
      />
    </div>
  );
};
