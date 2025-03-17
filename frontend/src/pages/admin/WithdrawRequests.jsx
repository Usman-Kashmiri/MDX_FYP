import { DataTable } from "mantine-datatable";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  fetchWithdrawRequestListForAdmin,
  updateWithdrawForAdmin,
} from "../../redux/actions/adminActions";
import { Avatar, Button, Modal, Select, Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { IconSearch } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { DatePickerInput } from "@mantine/dates";

const WithdrawRequests = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [changeStatus, setChangeStatus] = useState("pending");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);

  const { withDrawRequestList, loading, loaderOfButton } = useSelector(
    (state) => state?.admin
  );

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 8,
    total_pages: 1,
    total_records: 0,
  });

  const dispatch = useDispatch();

  const handleFetchWithdrawRequests = async () => {
    try {
      const res = await dispatch(
        fetchWithdrawRequestListForAdmin(pagination, selectedStatus, dateRange)
      );
      setPagination({
        ...pagination,
        total_pages: res.total_pages,
        total_records: res?.total_records || 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchWithdrawRequests();
  }, [pagination.page, selectedStatus, dateRange]);

  const requestColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "user",
      title: <Text>User</Text>,
      width: "auto",
      render: (row) => (
        <Link
          to={`/admin/user/statistics/${row?.user?.id}`}
          className="text-dark text-decoration-none"
        >
          <div className="d-flex flex-row w-100 h-100 cursor-pointer gap-2 bg-gray-hover">
            <Avatar
              radius="xl"
              src={row?.user?.image}
              alt={row?.user?.first_name + " " + row?.user?.last_name}
            />
            <div className="d-flex flex-column">
              <h5 className="m-0">
                {row?.user?.first_name + " " + row?.user?.last_name}
              </h5>
              <span>{row?.user?.email}</span>
            </div>
          </div>
        </Link>
      ),
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
      render: (record) => (
        <>
          {record?.status === "pending" ? (
            <div className="d-flex flex-row justify-content-end gap-2">
              <button
                className="rejected-btn"
                style={{
                  padding: "7px 14px",
                  fontSize: "12px",
                }}
                onClick={() => {
                  setChangeStatus({ status: "rejected", id: record?.id });
                  open();
                }}
              >
                Reject
              </button>
              <button
                className="approve-btn"
                style={{
                  padding: "7px 14px",
                  fontSize: "12px",
                }}
                onClick={() => {
                  setChangeStatus({ status: "approved", id: record?.id });
                  open();
                }}
              >
                Approve
              </button>
            </div>
          ) : (
            <Text
              style={{
                color: record?.status === "approved" ? "green" : "red",
                textTransform: "capitalize",
              }}
            >
              {record?.status}
            </Text>
          )}
        </>
      ),
      filter: (
        <Select
          label="Status "
          description="All Status"
          data={[
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ]}
          value={selectedStatus}
          placeholder="Search status"
          onChange={setSelectedStatus}
          icon={<IconSearch size={16} />}
          clearable
          searchable
        />
      ),
    },
    {
      accessor: "created_at",
      width: "auto",
      title: <Text>Datetime</Text>,
      render: ({ created_at }) =>
        dayjs(created_at).format("ddd DD MMM YYYY [at] hh:mm A"),
      filter: (
        <DatePickerInput
          clearable
          type="range"
          label="Pick dates range"
          placeholder="Pick dates range"
          value={dateRange}
          onChange={setDateRange}
          mx="auto"
          maw={400}
        />
      ),
    },
  ];

  const handleYesClick = async () => {
    const res = await dispatch(
      updateWithdrawForAdmin(changeStatus?.id, {
        status: changeStatus?.status,
      })
    );
    if (res.res === "success") {
      handleFetchWithdrawRequests();
    }
    close();
  };

  return (
    <div className="pt-4 pb-5 mb-5 px-2 px-sm-4">
      <div className="d-flex justify-content-between align-items-center w-100 mb-3">
        <h2 className="mb-0 text-of-transaction">Withdraw Requests</h2>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        size="xs"
        centered
        withCloseButton={false}
      >
        <div className="d-flex flex-column gap-3">
          <h3>Confirm Action</h3>
          <div>Are you sure you want to proceed?</div>
          <div className="d-flex flex-row justify-content-around">
            <Button
              className="grey-btn-of-cancels  text-capitalize"
              style={{
                padding: "0rem 1rem !important",
              }}
              onClick={close}
            >
              No
            </Button>
            <Button
              className="orange-btn-of-submit"
              style={{
                padding: "0rem 1rem !important",
              }}
              onClick={handleYesClick}
              disabled={loaderOfButton}
            >
              {loaderOfButton && <Spinner animation="border" />}
              Yes
            </Button>
          </div>
        </div>
      </Modal>
      <DataTable
        className="data-table-with-actions"
        withBorder
        records={withDrawRequestList || []}
        withColumnBorders
        striped
        highlightOnHover
        verticalSpacing={10}
        columns={requestColumn}
        totalRecords={pagination?.total_records}
        recordsPerPage={pagination?.per_page}
        page={pagination?.page}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        fetching={loading}
        minHeight={400}
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

export default WithdrawRequests;
