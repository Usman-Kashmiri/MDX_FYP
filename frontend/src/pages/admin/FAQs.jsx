import React, { useEffect } from "react";
import * as yup from "yup";
import { DataTable } from "mantine-datatable";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { IconArrowDown, IconArrowsUpDown } from "@tabler/icons-react";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Switch,
  Modal,
  Textarea,
  ScrollArea,
  Popover,
  Text,
} from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFaqs,
  deleteFaqs,
  fetchFAQsList,
  reorderFaqs,
  updateFaqs,
} from "../../redux/actions/adminActions";
import { useDisclosure } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";

const AdminFAQs = () => {
  const dispatch = useDispatch();

  const [opened, { open, close }] = useDisclosure(false);
  const [bodyRef] = useAutoAnimate();

  const { faqs } = useSelector((state) => state.admin);
  const [records, setRecords] = useState(faqs);

  const [initialModalValues, setInitialModalValues] = useState({
    id: 0,
    question: "",
    answer: "",
    is_published: false,
    order: 0,
  });

  const [modalType, setModalType] = useState("Create");

  const handleModal = (type, data) => {
    type === "Edit"
      ? setInitialModalValues(data)
      : setInitialModalValues({
          name: "",
        });

    setModalType(type);
    open();
  };

  useEffect(() => {
    setRecords(faqs);
  }, [faqs]);

  useEffect(() => {
    if (!faqs?.length || faqs?.length === 0) {
      dispatch(fetchFAQsList());
    }
  }, [faqs?.length, dispatch]);

  const moveUserUp = (index) => {
    if (index > 0) {
      let newRecords = [...records];
      [newRecords[index - 1], newRecords[index]] = [
        newRecords[index],
        newRecords[index - 1],
      ];
      const payload = newRecords?.map((item, index) => {
        return {
          id: item?.id,
          order: index + 1,
        };
      });
      dispatch(
        reorderFaqs({
          order: payload,
        })
      );
      setRecords(newRecords);
    }
  };

  const moveUserDown = (index) => {
    if (index < records.length - 1) {
      const newRecords = [...records];
      [newRecords[index], newRecords[index + 1]] = [
        newRecords[index + 1],
        newRecords[index],
      ];
      const payload = newRecords?.map((item, index) => {
        return {
          id: item?.id,
          order: index + 1,
        };
      });
      dispatch(
        reorderFaqs({
          order: payload,
        })
      );
      setRecords(newRecords);
    }
  };

  const form = useForm({
    initialValues: initialModalValues,
    validateInputOnBlur: true,
    validate: yupResolver(
      yup.object().shape({
        question: yup
          .string()
          .typeError("Enter Question")
          .required("Question is required"),
        answer: yup
          .string()
          .typeError("Enter Answer")
          .required("Answer is required"),
      })
    ),
  });

  useEffect(() => {
    if (initialModalValues) {
      form.setFieldValue("id", initialModalValues.id);
      form.setFieldValue("question", initialModalValues.question);
      form.setFieldValue("answer", initialModalValues.answer);
      form.setFieldValue(
        "is_published",
        initialModalValues.is_published || false
      );
    } else {
      form.setFieldValue("id", 0);
      form.setFieldValue("question", "");
      form.setFieldValue("answer", "");
      form.setFieldValue("is_published", false);
      form.setFieldValue("order", 0);
    }
  }, [initialModalValues]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.validate();
    if (!form.validate().hasErrors) {
      if (
        Object.keys(form.errors).length === 0 &&
        form.values.question !== "" &&
        form.values.answer !== ""
      ) {
        if (modalType === "Create") {
          const res = await dispatch(createFaqs(form.values));
          if (res === "success") {
            handleClose();
          }
        } else if (modalType === "Edit") {
          const res = await dispatch(updateFaqs(form.values.id, form.values));
          if (res === "success") {
            handleClose();
          }
        }
      }
    }
  };

  const handleClose = () => {
    form.reset();
    close();
  };

  const handleDelete = (id) => {
    dispatch(deleteFaqs(id));
  };

  const handleSwitchChange = (record, newStatus) => {
    const updatedRecord = { ...record, is_published: newStatus };
    if (updatedRecord) {
      dispatch(updateFaqs(record.id, updatedRecord));
    }
  };

  const columns = [
    {
      accessor: "move",
      textAlignment: "left",
      title: (
        <Center>
          <IconArrowsUpDown size={14} />
        </Center>
      ),
      render: (_, index) => (
        <Box display="flex">
          <ActionIcon
            variant="transparent"
            color="orange"
            disabled={index === 0}
            onClick={() => moveUserUp(index)}
          >
            <IconArrowUp size={18} />
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            color="orange"
            disabled={index === records.length - 1}
            onClick={() => moveUserDown(index)}
          >
            <IconArrowDown size={18} />
          </ActionIcon>
        </Box>
      ),
    },

    {
      accessor: "question",
      width: "40%",
      render: (record) => (
        <p className="faqs-question-answer mb-0">{record.question}</p>
      ),
    },
    {
      accessor: "answer",
      width: "40%",
      render: (record) => (
        <p className="faqs-question-answer mb-0">{record.answer}</p>
      ),
    },

    {
      accessor: "published",
      width: "20%",

      render: (record) => (
        <Switch
          size="md"
          color="orange"
          checked={record?.is_published === 1 ? true : false}
          onChange={() =>
            handleSwitchChange(record, record.is_published === 1 ? 0 : 1)
          }
          className="cursor-pointer"
        />
      ),
    },
    {
      accessor: "actions",
      width: "auto",
      textAlignment: "right",
      title: <Text>Actions</Text>,
      render: (record) => (
        <ActionButtons
          record={record}
          handleModal={handleModal}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <div className="pt-4 pb-3 px-4 mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>FAQs </h2>
        <div className="mb-1">
          <Button
            sx={{
              backgroundColor: "#db9651",
              "&:hover": { backgroundColor: "#d28b13" },
            }}
            onClick={() => handleModal("Create", null)}
            variant="filled"
            mb="md"
            className="btn-of-datatable"
          >
            Add FAQs
          </Button>
        </div>
      </div>
      <div>
        <DataTable
          className="data-table-with-actions"
          mb="xl"
          withBorder
          minHeight={250}
          columns={columns}
          records={records}
          bodyRef={bodyRef}
        />
      </div>
      <Modal
        centered
        opened={opened}
        onClose={close}
        size="md"
        scrollAreaComponent={ScrollArea.Autosize}
        title={modalType + " FAQs"}
      >
        <h2></h2>
        <form onSubmit={handleFormSubmit}>
          <Textarea
            placeholder="Enter Question"
            label="Question"
            autosize
            minRows={2}
            scrollAreaComponent={ScrollArea.Autosize}
            withAsterisk
            // required
            {...form.getInputProps("question")}
          />
          <Textarea
            placeholder="Enter Answer"
            // required
            scrollAreaComponent={ScrollArea.Autosize}
            label="Answer"
            autosize
            minRows={5}
            // maxRows={"auto"}
            withAsterisk
            {...form.getInputProps("answer")}
          />
          <div className="d-flex justify-content-between mt-2 ">
            <p>Want to publish</p>
            <Switch
              size="lg"
              color="orange"
              defaultChecked={form.values.is_published}
              {...form.getInputProps("is_published")}
            />
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button
              type="submit"
              sx={{
                backgroundColor: "#db9651",
                "&:hover": { backgroundColor: "#d28b13" },
              }}
              //   onClick={open}
              variant="filled"
              mb="md"
            >
              {modalType === "Edit" ? "Update FAQs" : modalType + " FAQs"}
            </Button>
          </div>
        </form>
      </Modal>
      {/* ... */}
    </div>
  );
};

const ActionButtons = ({ record, handleModal, handleDelete = null }) => {
  const { loading } = useSelector((state) => state.admin);

  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        justifyContent: "flex-end",
      }}
    >
      <ActionIcon onClick={() => handleModal("Edit", record)} variant="outline">
        <IconEdit />
      </ActionIcon>
      {handleDelete && (
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
                loading={loading}
                onClick={() => handleDelete(record.id)}
              >
                Confirm
              </Button>
            </Box>
          </Popover.Dropdown>
        </Popover>
      )}
    </Box>
  );
};

export default AdminFAQs;
