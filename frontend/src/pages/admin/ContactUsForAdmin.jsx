import { DataTable } from "mantine-datatable";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteMessage,
  fetchMessages,
  respondMessage,
} from "../../redux/actions/adminActions";
import {
  ActionIcon,
  Box,
  Button,
  Modal,
  Popover,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { successMessage } from "../../globalFunctions";
import { IconTrash } from "@tabler/icons-react";
import { useForm, yupResolver } from "@mantine/form";
import { responseOfMessageForAdminSchema } from "../../validations/ValidationSchema";
import { Spinner } from "react-bootstrap";
import { AiOutlineEye } from "react-icons/ai";
import { newContactUsMessage } from "../../redux/actions/webActions";

const ContactUsForAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contactMessages, loading } = useSelector((state) => state?.admin);
  const { socket } = useSelector((state) => state?.web);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 8,
    total_pages: 1,
    total_records: 0,
  });

  const handleFetchMessages = async () => {
    try {
      const res = await dispatch(fetchMessages(pagination));
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
    socket.on("newContactUsMessage", (data) => {
      dispatch(newContactUsMessage(data));
    });
    handleFetchMessages(pagination);
  }, [pagination.page]);

  const messagesColumn = [
    {
      accessor: "SNO",
      title: <Text>#</Text>,
      width: "auto",
      render: (record, i) => <Text>{i + 1}</Text>,
    },
    {
      accessor: "username",
      title: <Text>UserName</Text>,
      width: "auto",
      render: (record, i) => (
        <Text
          className="text-capitalize"
          onClick={() => {
            navigate(`/dashboard/message/${record?.id}`, { state: record });
          }}
          style={{
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {record?.username}
        </Text>
      ),
    },
    {
      accessor: "email",
      title: <Text>Email</Text>,
      width: "auto",
    },
    {
      accessor: "responses",
      width: "auto",
      title: <Text>Responses</Text>,
      render: (record) => (
        <>
          <Text>{record?.responses?.length}</Text>
        </>
      ),
    },
    {
      accessor: "actions",
      width: "auto",
      textAlignment: "right",
      title: <Text>Actions</Text>,
      render: (record) => (
        <>
          <ActionButtons
            record={record}
            handleDeleteMessage={handleDeleteMessage}
          />
        </>
      ),
    },
  ];

  const handleDeleteMessage = async (id) => {
    const res = await dispatch(deleteMessage(id));
    if (res.res === "success") {
      successMessage(res.message);
      await dispatch(fetchMessages(pagination));
    }
  };

  return (
    <div className="pt-4 pb-3 px-2 px-sm-4">
      <div className="d-flex justify-content-between align-items-center w-100">
        <h2 className="text-of-transaction">Contact Us Messages</h2>
      </div>
      <div className="mt-4">
        <DataTable
          className="data-table-with-actions "
          withBorder
          records={contactMessages || []}
          withColumnBorders
          striped
          highlightOnHover
          verticalSpacing={10}
          columns={messagesColumn}
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
    </div>
  );
};

export default ContactUsForAdmin;

const ActionButtons = ({ record, handleDeleteMessage }) => {
  const dispatch = useDispatch();
  const { loaderOfButton } = useSelector((state) => state.admin);
  const [showModal, setShowModal] = useState(false);
  const [opened, { close, open }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      id: record?.id,
      subjeect: "",
      message: "",
    },
    validateInputOnBlur: true,
    validateInputOnChange: ["subject", "message"],
    validate: yupResolver(responseOfMessageForAdminSchema),
  });

  useEffect(() => {
    form.setFieldValue("id", record?.id);
  }, [record?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.validate();
    if (Object.keys(form.errors).length === 0) {
      const res = await dispatch(respondMessage(form.values));
      if (res?.res === "success") {
        setShowModal(false);
        form.reset();
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        justifyContent: "flex-end",
      }}
    >
      <Link to={`/dashboard/message/${record?.id}`} state={record}>
        <ActionIcon variant="outline">
          <Text
            style={{
              marginTop: "0",
              color: "grey",
              display: "flex",
              fontSize: "25px",
            }}
          >
            <AiOutlineEye />
          </Text>
        </ActionIcon>
      </Link>

      <Popover
        width={220}
        position="bottom"
        withArrow
        shadow="md"
        opened={opened}
      >
        <Popover.Target>
          <ActionIcon onClick={open} variant="outline" color="red">
            <IconTrash />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm">Are you sure you want to delete this record?</Text>
          <Box
            mt={10}
            sx={{
              display: "flex",
              gap: "20px",
              justifyContent: "space-between",
            }}
          >
            <Button color="gray" onClick={close}>
              cancel
            </Button>
            <Button
              color="red"
              loading={loaderOfButton}
              onClick={() => handleDeleteMessage(record?.id)}
            >
              Confirm
            </Button>
          </Box>
        </Popover.Dropdown>
      </Popover>
      <Modal
        opened={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        centered
        title={"Respond: "}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Subject"
            id="subject"
            name="subject"
            placeholder="Enter Subject"
            {...form.getInputProps("subject")}
          />
          <Textarea
            label="Message"
            id="message"
            name="message"
            placeholder="Enter Message"
            {...form.getInputProps("message")}
          />
          <div className="d-flex flex-row justify-content-end mt-4">
            <Button
              type="submit"
              className="primary-btn"
              disabled={loaderOfButton}
            >
              {loaderOfButton && <Spinner />}
              Respond
            </Button>
          </div>
        </form>
      </Modal>
    </Box>
  );
};
