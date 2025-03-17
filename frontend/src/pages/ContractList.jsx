import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  contractList,
  createMilestoneStage,
} from "../redux/actions/lawyerAction";
import { useEffect } from "react";
import { contractListForClient } from "../redux/actions/clientActions";
import { contractListForAdmin } from "../redux/actions/adminActions";
import {
  Button,
  Input,
  Modal,
  ScrollArea,
  Tabs,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

const ContractList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("user")).role;
  const [selectedTab, setSelectedTab] = useState("all");
  const dispatch = useDispatch();
  const [selectedContract, setSelectedContract] = useState();
  const [contractListData, setContractListData] = useState([]);
  const state = useSelector((state) => state);
  const [isLoading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 6,
    total_records: 0,
  });

  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  const fetchContracts = async () => {
    setLoading(true);
    try {
      let res;
      if (role === "Lawyer") {
        res = await dispatch(contractList(selectedTab, pagination));
      } else if (role === "Client") {
        res = await dispatch(contractListForClient(selectedTab, pagination));
      } else if (role === "SuperAdmin") {
        res = await dispatch(contractListForAdmin(selectedTab, pagination));
      }
      setPagination({ ...pagination, total_records: res?.total_records || 0 });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [role, dispatch, selectedTab, pagination.page]);

  useEffect(() => {
    if (role === "Lawyer") {
      setContractListData(state?.lawyer?.contractsList?.contracts);
    } else if (role === "Client") {
      setContractListData(state?.client?.contractsList?.contracts);
    } else if (role === "SuperAdmin") {
      setContractListData(state?.admin?.contractsList?.contracts);
    }
  }, [role, state]);

  const clientColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (_, i) => (
        <Text>{(pagination?.page - 1) * pagination?.per_page + i + 1}</Text>
      ),
    },
    {
      accessor: "title",
      title: <Text>Contract Title</Text>,
      width: "auto",
      render: (record, i) => (
        <Text key={i} className="text-capitalize">
          {record?.title}
        </Text>
      ),
    },
    {
      accessor: "type",
      width: "auto",
      title: <Text>Contract Type</Text>,
      render: (record, i) => (
        <Text
          key={i}
          style={{
            textTransform: "capitalize",
          }}
        >
          {record?.type}
        </Text>
      ),
    },
    {
      accessor: "start_date",
      title: <Text>Start Date</Text>,
      width: "auto",
      render: (record, i) => (
        <Text key={i}>{dayjs(record?.start_date).format("YYYY-MM-DD")}</Text>
      ),
    },
    {
      accessor: "fees_amount",
      title: <Text>Fee Amount</Text>,
      width: "auto",
    },

    {
      accessor: role === "Client" ? "client" : "lawyer",
      title: <Text>{role === "Client" ? "Lawyer" : "Client"}</Text>,
      width: "auto",
      render: (record, i) => (
        <>
          <Text
            key={i}
            style={{
              fontWeight: 500,
              color: "#af720f",
            }}
          >
            {role === "Client"
              ? `${record?.lawyer?.first_name} ${record?.lawyer?.last_name}`
              : `${record?.client?.first_name} ${record?.client?.last_name}`}
          </Text>
          <Text
            style={{
              opacity: "0.7",
            }}
          >
            {role === "Client"
              ? `${record?.lawyer?.email}`
              : `${record?.client?.email}`}
          </Text>
        </>
      ),
    },
    {
      accessor: "status",
      title: <Text>Status</Text>,
      width: "auto",
      render: (record, i) => (
        <Text
          key={i}
          style={{
            textTransform: "capitalize",
          }}
        >
          {record?.status}
        </Text>
      ),
    },
    {
      accessor: "id",
      title: (
        <Text
          style={{
            textAlign: "center",
          }}
        >
          Detail
        </Text>
      ),
      width: "auto",
      render: (record, i) => (
        <Button
          key={i}
          className="primary-btn w-100 py-1 h-25 text-capitalize"
          onClick={() => {
            navigate(`/dashboard/contract-details/${record?.id}`);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];

  const lawyerColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "title",
      title: <Text>Contract Title</Text>,
      width: "auto",
      render: (record, i) => (
        <Text key={i} className="text-capitalize">
          {record?.title}
        </Text>
      ),
    },
    {
      accessor: "type",
      width: "auto",
      title: <Text>Contract Type</Text>,
      render: (record) => (
        <Text
          style={{
            textTransform: "capitalize",
          }}
        >
          {record?.type}
        </Text>
      ),
    },
    {
      accessor: "start_date",
      title: <Text>Start Date</Text>,
      width: "auto",
      render: (record) => (
        <Text>{dayjs(record?.start_date).format("YYYY-MM-DD")}</Text>
      ),
    },
    {
      accessor: "fees_amount",
      title: <Text>Fee Amount</Text>,
      width: "auto",
    },

    {
      accessor: role === "Client" ? "client" : "lawyer",
      title: <Text>{role === "Client" ? "Lawyer" : "Client"}</Text>,
      width: "auto",
      render: (record) => (
        <>
          <Text
            style={{
              fontWeight: 500,
              color: "#af720f",
            }}
          >
            {role === "Client"
              ? `${record?.lawyer?.first_name} ${record?.lawyer?.last_name}`
              : `${record?.client?.first_name} ${record?.client?.last_name}`}
          </Text>
          <Text
            style={{
              opacity: "0.7",
            }}
          >
            {role === "Client"
              ? `${record?.lawyer?.email}`
              : `${record?.client?.email}`}
          </Text>
        </>
      ),
    },
    {
      accessor: "status",
      title: <Text>Status</Text>,
      width: "auto",
      render: (record) => (
        <Text
          style={{
            textTransform: "capitalize",
          }}
        >
          {record?.status}
        </Text>
      ),
    },
    {
      accessor: "id",
      title: (
        <Text
          style={{
            textAlign: "center",
          }}
        >
          Milestone
        </Text>
      ),
      width: "10%",
      render: (record) => (
        <Button
          className="primary-btn w-100 py-1 h-25 text-capitalize"
          onClick={() => {
            setSelectedContract(record?.id);
            open();
          }}
        >
          Add Milestones
        </Button>
      ),
    },
    {
      accessor: "id",
      title: (
        <Text
          style={{
            textAlign: "center",
          }}
        >
          Detail
        </Text>
      ),
      width: "auto",
      render: (record) => (
        <Button
          className="primary-btn w-100 py-1 h-25 text-capitalize"
          onClick={() => {
            navigate(`/dashboard/contract-details/${record?.id}`);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];

  const superAdminColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "title",
      title: <Text>Contract Title</Text>,
      width: "auto",
    },
    {
      accessor: "type",
      width: "auto",
      title: <Text>Contract Type</Text>,
      render: (record) => (
        <Text
          style={{
            textTransform: "capitalize",
          }}
        >
          {record?.type}
        </Text>
      ),
    },
    {
      accessor: "start_date",
      title: <Text>Start Date</Text>,
      width: "auto",
      render: (record) => (
        <Text>{dayjs(record?.start_date).format("YYYY-MM-DD")}</Text>
      ),
    },
    {
      accessor: "fees_amount",
      title: <Text>Fee Amount</Text>,
      width: "auto",
    },
    {
      accessor: "lawyer",
      title: <Text>Lawyer</Text>,
      width: "auto",
      render: (record) => (
        <>
          <Text
            style={{
              fontWeight: 500,
              color: "#af720f",
            }}
          >{`${record?.lawyer?.first_name} ${record?.lawyer?.last_name}`}</Text>

          <Text
            style={{
              opacity: "0.7",
            }}
          >{`${record?.lawyer?.email}`}</Text>
        </>
      ),
    },
    {
      accessor: "client",
      title: <Text>Client</Text>,
      width: "auto",
      render: (record) => (
        <>
          <Text
            style={{
              fontWeight: 500,
              color: "#af720f",
            }}
          >{`${record?.client?.first_name} ${record?.client?.last_name}`}</Text>
          <Text
            style={{
              opacity: "0.7",
            }}
          >{`${record?.client?.email}`}</Text>
        </>
      ),
    },
    {
      accessor: "status",
      title: <Text>Status</Text>,
      width: "auto",
      render: (record) => (
        <Text
          style={{
            textTransform: "capitalize",
          }}
        >
          {record?.status}
        </Text>
      ),
    },
    {
      accessor: "id",
      title: (
        <Text
          style={{
            textAlign: "center",
          }}
        >
          Detail
        </Text>
      ),
      width: "auto",
      render: (record) => (
        <Button
          className="primary-btn w-100 py-1 h-25 text-capitalize"
          onClick={() => {
            navigate(`/dashboard/contract-details/${record?.id}`);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];

  const form = useForm({
    initialValues: { name: "", description: "" },
    validate: {
      name: (value) => (value ? null : "Invalid name"),
      description: (value) => (value ? null : "Invalid description"),
    },
  });

  const handleStage = async (values) => {
    const data = { ...values, contract_id: selectedContract };
    const res = await dispatch(createMilestoneStage(data));
    if (res?.res === "success") {
      form.reset();
      close();
    }
  };

  return (
    <div className="pt-4 pb-3 px-4 mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Contract List: </h2>
        {role === "Lawyer" && (
          <button
            type="button"
            onClick={() => navigate("/lawyer/contract/create")}
            className=" brown-btn border-0 text-center mt-4 mb-3 text-capitalize btn btn-primary"
          >
            Create Contract
          </button>
        )}
      </div>

      <Tabs
        defaultValue="all"
        color="orange"
        style={{
          marginBottom: "4rem",
        }}
        className="mb-4"
      >
        <Tabs.List>
          <Tabs.Tab value="all" onClick={(e) => handleTabChange("all")}>
            All
          </Tabs.Tab>
          <Tabs.Tab value="pending" onClick={(e) => handleTabChange("pending")}>
            Pending
          </Tabs.Tab>
          <Tabs.Tab
            value="in-progress"
            onClick={(e) => handleTabChange("in-progress")}
          >
            In-Progress
          </Tabs.Tab>
          <Tabs.Tab
            value="completed"
            onClick={(e) => handleTabChange("completed")}
          >
            Completed
          </Tabs.Tab>
          <Tabs.Tab value="cancel" onClick={(e) => handleTabChange("cancel")}>
            Cancel
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel className="tabsss" value={selectedTab}>
          <DataTable
            className="data-table-with-actions mt-4"
            withBorder
            records={contractListData}
            withColumnBorders
            striped
            highlightOnHover
            verticalSpacing={10}
            columns={
              role === "SuperAdmin"
                ? superAdminColumn
                : role === "Lawyer"
                ? lawyerColumn
                : clientColumn
            }
            totalRecords={pagination.total_records}
            recordsPerPage={pagination.per_page}
            page={pagination.page}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            fetching={isLoading}
            minHeight={400}
            loaderVariant="dots"
            noRecordsText="No records found"
            paginationText={({ from, to, totalRecords }) =>
              `Records ${from} - ${to} of ${totalRecords}`
            }
            paginationSize="md"
          />
        </Tabs.Panel>
      </Tabs>
      <Modal
        centered
        opened={opened}
        onClose={close}
        size="md"
        scrollAreaComponent={ScrollArea.Autosize}
        title={"Add Milestone stage"}
      >
        <h2></h2>
        <form onSubmit={form.onSubmit(handleStage)}>
          <Input.Wrapper id={1} label="Name" required>
            <TextInput
              name="name"
              id="name"
              placeholder="Enter name"
              withAsterisk
              {...form.getInputProps("name")}
            />
          </Input.Wrapper>
          <Textarea
            placeholder="Enter description"
            scrollAreaComponent={ScrollArea.Autosize}
            label="Description"
            autosize
            minRows={5}
            withAsterisk
            {...form.getInputProps("description")}
          />

          <div className="d-flex justify-content-end mt-3">
            <Button
              type="submit"
              loading={state?.lawyer?.loading}
              disabled={state?.lawyer?.loading}
              sx={{
                backgroundColor: "#db9651",
                "&:hover": { backgroundColor: "#d28b13" },
              }}
              variant="filled"
              mb="md"
            >
              Add Stage
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContractList;
