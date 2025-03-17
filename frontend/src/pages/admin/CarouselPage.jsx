import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Image,
  Popover,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm, yupResolver } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addImageSchema,
  updateImageSchema,
} from "../../validations/ValidationSchema";
import {
  addAnImageOfCarousel,
  deleteAnImageOfCarousel,
  fetchCarousels,
  reorderCarousel,
  updateCarouselText,
} from "../../redux/actions/adminActions";
import dayjs from "dayjs";
import { IconArrowUp, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { IconArrowsUpDown } from "@tabler/icons-react";
import { IconArrowDown } from "@tabler/icons-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDisclosure } from "@mantine/hooks";

const CarouselPage = () => {
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();
  const [bodyRef] = useAutoAnimate();
  const { fetchCarousel, loading } = useSelector((state) => state?.admin);
  const [previews, setPreviews] = useState(null);
  const [files, setFiles] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const [showAddImageBox, setShowAddImageBox] = useState(false);
  const [showUpdateTextBox, setShowUpdateTextBox] = useState(false);

  useEffect(() => {
    dispatch(fetchCarousels());
  }, [dispatch]);

  useEffect(() => {
    setPreviews(
      files?.map((file, index) => {
        if (file !== null && typeof file === "object") {
          const imageUrl = URL.createObjectURL(file);
          return (
            <Image
              key={index}
              src={imageUrl}
              imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
          );
        } else if (typeof file === "string") {
          return <Image key={index} src={file} />;
        }
        return null;
      })
    );
  }, [files]);

  const initialValues = {
    image: null,
    alt_text: "",
    order: "",
  };
  const validateInputOnChangeFields = ["image", "alt_text", "order"];
  const form = useForm({
    initialValues: initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: validateInputOnChangeFields,
    validate: yupResolver(addImageSchema),
  });
  const formForText = useForm({
    initialValues: {
      text: "",
      punchline: "",
    },
    validateInputOnBlur: true,
    validateInputOnChange: ["text", "punchline"],
    validate: yupResolver(updateImageSchema),
  });
  const handleSubmitForAddImage = async (event) => {
    event.preventDefault();
    try {
      form.validate();
      if (!form.validate().hasErrors) {
        if (Object.keys(form.errors).length === 0) {
          const res = await dispatch(addAnImageOfCarousel(form.values));
          if (res?.res === "success") {
            form.reset();
            setFiles([]);
            setShowAddImageBox(false);
            await dispatch(fetchCarousels());
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmitForText = async (event) => {
    event.preventDefault();
    try {
      formForText.validate();
      if (Object.keys(formForText.errors).length === 0) {
        const res = await dispatch(
          updateCarouselText(carousels?.carousel_text?.id, formForText.values)
        );
        if (res?.res === "success") {
          formForText.reset();
          setShowUpdateTextBox(false);
          await dispatch(fetchCarousels());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    const res = await dispatch(deleteAnImageOfCarousel(id));
    if (res?.res === "success") {
      await dispatch(fetchCarousels());
    }
  };
  const moveUserUp = async (index) => {
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
        reorderCarousel({
          order: payload,
        })
      );
      await dispatch(fetchCarousels());
      setRecords(newRecords);
    }
  };
  const moveUserDown = async (index) => {
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
        reorderCarousel({
          order: payload,
        })
      );
      await dispatch(fetchCarousels());
      setRecords(newRecords);
    }
  };
  const columns = [
    {
      accessor: "move",
      textAlignment: "left",
      width: "5%",
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
      accessor: "image",
      width: "10%",
      render: (record) => (
        <Box className="image-of-carousel-in-table">
          <Image src={`${record?.image}`} alt={record?.alt_text} />
        </Box>
      ),
    },
    {
      accessor: "alt_text",
      minWidth: "auto",
      render: (record) => (
        <div className="w-50 d-flex flex-column justify-content-start ">
          <p
            className="text-carousel-table mb-0"
            style={{
              fontWeight: "bold",
            }}
          >
            {record?.alt_text}
          </p>
        </div>
      ),
    },
    {
      accessor: "created_at",
      minWidth: "auto",
      title: "Created At",
      render: (record) => (
        <div className="w-50 d-flex flex-column justify-content-start ">
          <p
            style={{
              opacity: "0.75",
            }}
            className="text-carousel-table mb-0"
          >
            {dayjs(record?.created_at)?.format("YYYY-MM-DD")}
          </p>
        </div>
      ),
    },

    {
      accessor: "actions",
      width: "auto",
      textAlignment: "right",
      title: <Text>Actions</Text>,
      render: (record) => (
        <div className="me-3">
          <ActionButtons record={record} handleDelete={handleDelete} />
        </div>
      ),
    },
  ];
  useEffect(() => {
    setCarousels(fetchCarousel);
    setRecords(fetchCarousel?.carousel_images);
    formForText?.setFieldValue(
      "punchline",
      fetchCarousel?.carousel_text?.punchline
    );
    formForText?.setFieldValue("text", fetchCarousel?.carousel_text?.text);
  }, [fetchCarousel]);
  return (
    <div className="pb-md-5 pb-0 mb-md-5 px-md-5 px-3 min-vh-50 ">
      {carousels?.carousel_images?.length >= 0 && (
        <>
          <div className="view-carousel w-100 position-relative">
            <Carousel
              className="mx-auto carousel-container-in-carousel"
              styles={{
                control: {
                  "&[data-inactive]": {
                    opacity: 0,
                    cursor: "default",
                  },
                },
              }}
            >
              {carousels?.carousel_images?.map((item, key) => {
                return (
                  <Carousel.Slide key={key}>
                    <Image src={`${item?.image}`} alt={item?.alt_text} />
                  </Carousel.Slide>
                );
              })}
            </Carousel>
            <div className="text-container-in-carousel">
              <p className="text-line-1">{carousels?.carousel_text?.text}</p>
              <p className="text-line-2">
                {carousels?.carousel_text?.punchline}
              </p>
            </div>
          </div>
          <div
            className={`d-flex flex-row  align-items-center ${
              !showAddImageBox && !showUpdateTextBox
                ? "justify-content-between"
                : !showUpdateTextBox
                ? "justify-content-start"
                : !showAddImageBox && "justify-content-end"
            }`}
          >
            {!showUpdateTextBox && (
              <div className="d-flex justify-content-end  mt-4 gap-3 mb-4 ">
                <button
                  disabled={loading}
                  onClick={() => {
                    setShowUpdateTextBox(true);
                  }}
                  className="primary-btn text-capitalize btn-of-datatable"
                >
                  {/* {loading && <Spinner animation="border" />} */}
                  Update text
                </button>
              </div>
            )}
            {!showAddImageBox && (
              <div className="d-flex justify-content-end  mt-4 gap-3 mb-4 ">
                <button
                  disabled={loading}
                  onClick={() => {
                    setShowAddImageBox(true);
                  }}
                  className="primary-btn text-capitalize btn-of-datatable"
                >
                  {/* {loading && <Spinner animation="border" />} */}
                  Add Image
                </button>
              </div>
            )}
          </div>
          {showUpdateTextBox && (
            <div className="mt-5">
              <form
                onSubmit={handleSubmitForText}
                className="manage-profile-form"
              >
                <Row>
                  <Col xs={12}>
                    <TextInput
                      label="Text"
                      id="text"
                      name="text"
                      value={formForText?.text}
                      placeholder="Enter text"
                      {...formForText.getInputProps("text")}
                    />
                  </Col>
                  <Col xs={12} className="d-flex flex-column mt-3">
                    <TextInput
                      label="Punchline"
                      id="punchline"
                      name="punchline"
                      value={formForText?.punchline}
                      placeholder="Enter punchline"
                      {...formForText.getInputProps("punchline")}
                    />
                  </Col>

                  <Col
                    xs={12}
                    className="d-flex justify-content-end  mt-4 gap-3 mb-4 align-items-stretch"
                  >
                    <Button
                      color="gray"
                      onClick={() => {
                        setShowUpdateTextBox(false);
                      }}
                      className="btn-of-datatable"
                    >
                      Cancel
                    </Button>
                    <button
                      disabled={loading}
                      type="submit"
                      className="primary-btn btn-of-datatable text-capitalize"
                    >
                      {loading && <Spinner animation="border" />}
                      Update
                    </button>
                  </Col>
                </Row>
              </form>
            </div>
          )}
          {showAddImageBox && (
            <div className="mt-5">
              <form
                onSubmit={handleSubmitForAddImage}
                className="manage-profile-form"
              >
                <Row>
                  <Col xs={12}>
                    <Dropzone
                      accept={IMAGE_MIME_TYPE}
                      maxFiles={1}
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        setFiles(acceptedFiles);
                        form.setFieldValue("image", acceptedFiles[0]);
                      }}
                      className="hi-there-dfdfdf"
                      style={{}}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent:
                          previews?.length > 0 ? "flex-start" : "center",
                        minHeight: "130px",
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {previews?.length === 0 && (
                        <Text
                          align="center"
                          style={{
                            fontWeight: "bold",
                            height: "100%",
                            margin: "auto",
                          }}
                        >
                          Drop images here
                        </Text>
                      )}
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <SimpleGrid
                          columns={1}
                          mt={previews?.length > 0 ? "xl" : 0}
                          gap="1rem"
                          className="image-preview-of-create-blog"
                          style={{
                            width: "60%",
                            marginTop: "0",
                            textAlign: "center",
                          }}
                        >
                          {previews}
                        </SimpleGrid>
                      </div>
                    </Dropzone>
                  </Col>
                  <Col xs={12} md={8} className="d-flex flex-column mt-3">
                    <TextInput
                      label="Alt Text"
                      id="alt_text"
                      name="alt_text"
                      placeholder="Enter text"
                      {...form.getInputProps("alt_text")}
                    />
                  </Col>
                  <Col xs={12} md={4} className="d-flex flex-column mt-3">
                    <TextInput
                      label="Order"
                      id="order"
                      name="order"
                      placeholder="Enter order"
                      {...form.getInputProps("order")}
                    />
                  </Col>
                  <Col
                    xs={12}
                    className="d-flex justify-content-end  mt-4 gap-3 mb-4 align-items-stretch"
                  >
                    <Button
                      color="gray"
                      onClick={() => {
                        setShowAddImageBox(false);
                      }}
                      className="btn-of-datatable"
                    >
                      Cancel
                    </Button>
                    <button
                      disabled={loading}
                      type="submit"
                      className="primary-btn text-capitalize btn-of-datatable"
                    >
                      {loading && <Spinner animation="border" />}
                      Add
                    </button>
                  </Col>
                </Row>
              </form>
            </div>
          )}
          <div className="mt-5">
            <DataTable
              className="data-table-with-actions"
              mb="xl"
              withBorder
              minHeight={160}
              columns={columns}
              records={records}
              bodyRef={bodyRef}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CarouselPage;

const ActionButtons = ({ record, handleDelete = null }) => {
  const { loading } = useSelector((state) => state?.admin);

  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        justifyContent: "flex-end",
      }}
    >
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
                onClick={() => handleDelete(record?.id)}
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
