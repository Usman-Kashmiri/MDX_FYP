import {
  Button,
  Group,
  NumberInput,
  Select,
  TextInput,
  Textarea,
  Avatar,
  Text,
  SimpleGrid,
  Image,
  Input,
  Flex,
  Box,
  AspectRatio,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { IconCloudUpload } from "@tabler/icons-react";
import React, { forwardRef, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Fade from "react-reveal/Fade";
import { ContractCreationSchema } from "../validations/ValidationSchema";
import { useDispatch, useSelector } from "react-redux";
import { clientList, contractCreation } from "../redux/actions/lawyerAction";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IoIosCloseCircle } from "react-icons/io";
import CsvImage from "../assets/images/csv.png";
import DocxImage from "../assets/images/docx.png";
import { errorMessage } from "../globalFunctions";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import PdfViewer from "../components/Chat/bubblebox/pdfViewer";
import pdfIcon from "../assets/images/chat/extensions/pdf.png";
const ContractCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [attachSrc, setAttachSrc] = useState({
    isClickable: false,
    src: "",
    type: "",
  });

  const { clientsList, loading } = useSelector((state) => state?.lawyer);

  const initialValues = {
    contract_type: "",
    contract_title: "",
    client: "",
    start_date: null,
    fees_amount: "",
    contract_clauses: "",
    additional_note: "",
    documents: [],
  };

  const validateInputOnChange = [
    "contract_type",
    "contract_title",
    "client",
    "start_date",
    "fees_amount",
  ];

  const form = useForm({
    initialValues: initialValues,
    validateInputOnChange: validateInputOnChange,
    validate: yupResolver(ContractCreationSchema),
  });

  useEffect(() => {
    if (location?.state?.id) {
      form.setFieldValue("client", location?.state?.id);
    }
  }, [location?.state]);

  useEffect(() => {
    dispatch(clientList());
  }, [dispatch, form.values.client]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    form.validate();

    if (!form.validate().hasErrors) {
      if (Object.keys(form.errors).length == 0) {
        const data = {
          ...form.values,
          documents: form.values.documents.map((file) => file.file),
          start_date: dayjs(form?.start_date).format("YYYY-MM-DD"),
        };
        try {
          const res = await dispatch(contractCreation(data));
          if (res === "success") {
            form.reset();
            navigate("/lawyer/contracts");
          }
        } catch (error) {
          console.error("Error during contract creation:", error);
        }
      }
    }
  };

  const handleFilesChange = (newFiles) => {
    const validFiles = newFiles.filter((file) => file.size <= 10485760);
    const oversizedFiles = newFiles.filter((file) => file.size > 10485760);

    if (oversizedFiles.length > 0) {
      errorMessage("File size must not be greater than 10MBs");
    }

    const remainingSpace = 10 - form.values.documents.length;

    if (remainingSpace < validFiles.length) {
      const filesToAdd = validFiles.slice(0, remainingSpace);
      errorMessage("You can only upload up to 10 files.");

      const updatedFiles = filesToAdd.map((file) => {
        const randomString = Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now().toString(36);
        const id = randomString + timestamp;
        return { file, id };
      });

      form.setFieldValue("documents", [
        ...form.values.documents,
        ...updatedFiles,
      ]);
      return;
    }

    const updatedFiles = validFiles.map((file) => {
      const randomString = Math.random().toString(36).substr(2, 9);
      const timestamp = Date.now().toString(36);
      const id = randomString + timestamp;
      return { file, id };
    });

    form.setFieldValue("documents", [
      ...form.values.documents,
      ...updatedFiles,
    ]);
  };

  const removeFile = (id) => {
    form.setFieldValue(
      "documents",
      form.values.documents.filter((file) => file.id !== id)
    );
  };

  const handleTextEditorChange = (name, value) => {
    form.setFieldValue(name, value);
  };

  const previews = form.values.documents.map((file, index) => {
    const fileUrl = URL.createObjectURL(file.file);
    return (
      <Box
        title={file.file.name}
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
          cursor: "pointer",
          border: '1px solid #eeddc8',
          borderRadius: '5px',
          ":hover": {
            backgroundColor: "#00000029",
            ".close-btn": {
              opacity: 1,
            },
          },
        }}
        key={index}
      >
        {file.file.type.includes("pdf") ? (
          <img
            src={pdfIcon}
            style={{
              width: "40px",
              objectFit: "cover",
              height: "fit-content",
            }}
          />
        ) : file.file.type.includes("text/csv") ? (
          <img
            src={CsvImage}
            style={{
              width: "40px",
              objectFit: "cover",
              height: "fit-content",
            }}
          />
        ) : file.file.type.includes("application/vnd.openxmlfor") ? (
          <img
            src={DocxImage}
            style={{
              width: "40px",
              objectFit: "cover",
              height: "fit-content",
            }}
          />
        ) : file.file.type.includes("video") ? (
          <video
            src={fileUrl}
            autoPlay={true}
            muted
            loop
            style={{
              width: "40px",
              objectFit: "cover",
              height: "50px",
            }}
          />
        ) : file.file.type.includes("audio") ? (
          <audio
            src={fileUrl}
            controls
            style={{
              width: "40px",
              objectFit: "cover",
              height: "fit-content",
            }}
          />
        ) : (
          <Image
            style={{
              width: "40px",
              objectFit: "cover",
              height: "fit-content",
            }}
            key={index}
            src={fileUrl}
            imageProps={{ onLoad: () => URL.revokeObjectURL(fileUrl) }}
          />
        )}
        <Box
          as="span"
          className="close-btn"
          sx={{
            opacity: 0,
            position: "absolute",
            right: "0",
            top: "-4px",
          }}
          onClick={() => removeFile(file.id)}
        >
          <IoIosCloseCircle size={22} color="white" />
        </Box>
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
          {file.file.name.length > 15
            ? (() => {
              let filename = file.file.name;
              let res = filename.slice(
                filename.length / 2 - filename.length / 3,
                filename.length / 2 + filename.length / 3
              );
              let newRes = filename.replace(res, ".....");
              return newRes;
            })()
            : file.file.name}
        </Text>
        <a href={fileUrl} download></a>
      </Box>
    );
  });

  return (
    <Fade>
      <div className="p-md-5 p-3 px-2">
        <h2>Contract Creation</h2>
        <form onSubmit={handleFormSubmit}>
          <Row>
            <Col style={{ marginBottom: "15px", position: "relative" }} md={6}>
              <Select
                label="Client"
                placeholder="Select Client"
                data={clientsList?.map((obj) => {
                  return {
                    label: `${obj?.client?.first_name} ${obj?.client?.last_name}`,
                    value: obj?.client?.id,
                    profile: obj?.client?.profile,
                  };
                })}
                clearable
                itemComponent={SelectItem}
                searchable
                maxDropdownHeight={400}
                nothingFound="404 - nothing found!"
                withAsterisk
                filter={(value, item) =>
                  item?.label
                    ?.toLowerCase()
                    ?.includes(value?.toLowerCase()?.trim())
                }
                {...form.getInputProps("client")}
              />
            </Col>

            <Col style={{ marginBottom: "15px" }} md={6}>
              <TextInput
                label="Contract Title"
                name="contract_title"
                placeholder="Contract Title"
                withAsterisk
                {...form.getInputProps("contract_title")}
              />
            </Col>

            <Col style={{ marginBottom: "15px", position: "relative" }} md={6}>
              <Select
                label="Contract Type"
                name="contract_type"
                placeholder="Select Contract Type"
                defaultValue="select Type"
                data={[
                  { label: "long term", value: "long term" },
                  { label: "short term", value: "short term" },
                ]}
                withAsterisk
                {...form.getInputProps("contract_type")}
              />
            </Col>

            <Col style={{ marginBottom: "15px", position: "relative" }} md={6}>
              <DatePickerInput
                label="Starting Date"
                name="start_date"
                placeholder="Pick date"
                valueFormat="YYYY-MM-DD"
                mx="auto"
                maw={400}
                minDate={new Date()}
                withAsterisk
                {...form.getInputProps("start_date")}
              />
            </Col>

            <Col style={{ marginBottom: "15px" }} md={6}>
              <NumberInput
                name="fees_amount"
                label="Fee"
                type="number"
                placeholder="Amount"
                withAsterisk
                min={0}
                {...form.getInputProps("fees_amount")}
              />
            </Col>

            <Col style={{ marginBottom: "15px" }} xs={12}>
              <Input.Wrapper
                label="Contract Clauses"
                withAsterisk
                sx={{
                  li: {
                    listStyle: "unset",
                  },
                }}
              >
                <TipTapTextEditor
                  content={form.values.contract_clauses}
                  placeholder="Write down the contract clauses here."
                  name="contract_clauses"
                  onChange={handleTextEditorChange}
                />
              </Input.Wrapper>
            </Col>

            <Col style={{ marginBottom: "15px" }} xs={12}>
              <Input.Wrapper label="Supporting Documents">
                {form.values.documents.length < 10 && (
                  <Dropzone
                    accept={MIME_TYPES}
                    onDrop={(value) => handleFilesChange(value)}
                    sx={{
                      minHeight: "130px",
                      border: "2px dashed #ccc",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <Flex
                      sx={{
                        pointerEvents: "none",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Dropzone.Idle>
                        <IconCloudUpload
                          style={{ width: "40px", height: "40px" }}
                          stroke={1.5}
                        />
                      </Dropzone.Idle>
                      <Text
                        sx={{
                          fontWeight: 700,
                          fontSize: "lg",
                          marginTop: "xl",
                        }}
                      >
                        <Dropzone.Idle>
                          Upload supporting documents
                        </Dropzone.Idle>
                      </Text>
                      <Text
                        sx={{
                          fontSize: "sm",
                          marginTop: "xs",
                          color: "dimmed",
                        }}
                      >
                        Drag and drop files here to upload. Each file must be
                        less than 10MB in size.
                      </Text>
                    </Flex>
                  </Dropzone>
                )}
              </Input.Wrapper>

              <Flex
                gap={"10px"}
                wrap={"wrap"}
                mt={previews.length > 0 ? "xl" : 0}
              >
                {previews}
              </Flex>
            </Col>

            <Col style={{ marginBottom: "15px" }} xs={12}>
              <Input.Wrapper
                label="Additional Notes"
                sx={{
                  li: {
                    listStyle: "unset",
                  },
                }}
              >
                <TipTapTextEditor
                  content={form.values.additional_note}
                  placeholder="Write down some additional notes here, if any."
                  name="additional_note"
                  onChange={handleTextEditorChange}
                />
              </Input.Wrapper>
            </Col>

            <div
              style={{
                marginTop: "3rem",
                display: "flex",
                justifyContent: "end",
                width: "100%",
                marginBottom: "5rem",
              }}
            >
              <div className="d-flex justify-content-end">
                <Button
                  loading={loading}
                  disabled={loading}
                  className="signinbtn"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>
          </Row>
        </form>
      </div>
    </Fade>
  );
};

const SelectItem = forwardRef(({ profile, label, ...others }, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      <Avatar size={50} src={profile} radius={"xl"} />

      <div>
        <Text size="sm">{label}</Text>
      </div>
    </Group>
  </div>
));

const TipTapTextEditor = ({
  content = "",
  placeholder = "",
  name,
  onChange,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(name, editor.getHTML());
    },
  });

  return (
    <RichTextEditor editor={editor} onChange={onChange}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default ContractCreation;
