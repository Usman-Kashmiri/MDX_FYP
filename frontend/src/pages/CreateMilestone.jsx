import {
  Input,
  Modal,
  ScrollArea,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import React from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  CreatemilestoneStageschema,
  CreatemilestoneStepschema,
} from "../validations/ValidationSchema";
import { errorMessage, successMessage } from "../globalFunctions";
import {
  contractList,
  createMilestoneStage,
  createMilestoneStep,
  getMilestoneStageWithSteps,
} from "../redux/actions/lawyerAction";
import { Fade } from "react-reveal";
import { useEffect } from "react";
import { useState } from "react";
import ReadMoreModal from "../components/layout/ReadMoreModal";
import { useDisclosure } from "@mantine/hooks";

const CreateMilestone = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const { contractsList, milestoneStages } = useSelector(
    (state) => state?.lawyer
  );

  const [contract, setContract] = useState([]);
  const [addSteps, setAddSteps] = useState(false);
  const [stages, setStages] = useState([]);
  console.log(location.pathname);
  const isStage = location.pathname === "/lawyer/milestone/stage/35";
  const isStep = location.pathname === "/dashboard/create-milestone-step";

  useEffect(() => {
    dispatch(contractList("all"));
  }, [dispatch]);

  useEffect(() => {
    setContract(
      contractsList?.map((item) => {
        return {
          value: item?.id,
          label: item?.title,
        };
      })
    );
  }, [contractsList]);

  useEffect(() => {
    setStages(
      milestoneStages?.map((item) => {
        return {
          value: item?.id,
          label: item?.name,
        };
      })
    );
  }, [milestoneStages]);

  const initialValuesForStage = {
    contract_id: id,
    name: "",
    description: "",
  };

  const initialValuesForStep = {
    stage_id: "",
    name: "",
    description: "",
  };

  const validateInputOnChangeForStage = {
    contract_id: "",
    name: "",
    description: "",
  };

  const validateInputOnChangeForStep = {
    stage_id: "",
    name: "",
    description: "",
  };

  const form = useForm({
    initialValues: initialValuesForStage,

    validateInputOnChange: validateInputOnChangeForStage,

    validate: yupResolver(CreatemilestoneStageschema),
    validateInputOnBlur: true,
  });
  const form2 = useForm({
    initialValues: initialValuesForStep,
    validateInputOnChange: validateInputOnChangeForStep,
    validate: yupResolver(CreatemilestoneStepschema),
    validateInputOnBlur: true,
  });

  const handleFormSubmit = async (e) => {
    // e.preventDefault();
    form.validate();
    if (Object.keys(form.errors).length === 0) {
      try {
        const res = await dispatch(
          isStage
            ? createMilestoneStage(form?.values)
            : isStep && createMilestoneStep(form?.values)
        );

        if (res.res === "success") {
          setAddSteps(true);
          successMessage(
            `${isStage ? "Stage" : isStep && "Step"} created successfully`
          );
          // form.reset();
        }
      } catch (error) {
        console.error("Error during creation:", error);
      }
    } else {
      errorMessage("Please fill correct");
    }
  };

  const handleContractChange = async (e) => {
    await dispatch(getMilestoneStageWithSteps(e));
  };

  return (
    <Fade>
      <div className="p-md-5 p-3 px-2">
        <div className="d-flex justify-content-between align-items-center">
          <h2>
            {isStage
              ? "Create Milstone Stage"
              : isStep && "Create Milstone Step"}
          </h2>
          {addSteps ? (
            <div className="d-flex justify-content-end">
              <Button className="signinbtn ">Add Steps</Button>
            </div>
          ) : null}
        </div>
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Row>
            {isStage && (
              <Col xs={12}>
                <Input.Wrapper id={1} label="Name" required>
                  <TextInput
                    name="name"
                    id="name"
                    placeholder="Enter name"
                    withAsterisk
                    {...form.getInputProps("name")}
                  />
                </Input.Wrapper>
              </Col>
            )}
            {/* {isStage && (
              <Col xs={12} md={6}>
                <Input.Wrapper id={1} label="Contract" required>
                  <Select
                    name="contract_id"
                    id="contract_id"
                    placeholder="Select Contract"
                    data={contract}
                    withAsterisk
                    {...form.getInputProps("contract_id")}
                  />
                </Input.Wrapper>
              </Col>
            )} */}
            {isStep && (
              <Col xs={12} md={6}>
                <Input.Wrapper id={1} label="Contract" required>
                  <Select
                    name="contract_id"
                    id="contract_id"
                    placeholder="Select Contract"
                    data={contract}
                    onChange={(e) => {
                      handleContractChange(e);
                    }}
                    withAsterisk
                  />
                </Input.Wrapper>
              </Col>
            )}
            {isStep && (
              <Col xs={12} md={6}>
                <Input.Wrapper id={1} label="Stage" required>
                  <Select
                    name="stage_id"
                    id="stage_id"
                    placeholder="Select Stage"
                    data={stages}
                    withAsterisk
                    {...form.getInputProps("stage_id")}
                  />
                </Input.Wrapper>
              </Col>
            )}
            {isStep && (
              <Col xs={12}>
                <Input.Wrapper id={1} label="Name" required>
                  <TextInput
                    name="name"
                    id="name"
                    placeholder="Enter name"
                    withAsterisk
                    {...form.getInputProps("name")}
                  />
                </Input.Wrapper>
              </Col>
            )}

            <Col style={{ marginTop: "10px" }} xs={12}>
              <Input.Wrapper id={1} label="Description" required>
                <Textarea
                  name="description"
                  id="description"
                  minRows={5}
                  maxRows="auto"
                  placeholder="Enter description"
                  withAsterisk
                  {...form.getInputProps("description")}
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
                <Button disabled={false} className="signinbtn " type="submit">
                  {false && <Spinner animation="border" />}
                  Submit
                </Button>
              </div>
            </div>
          </Row>
        </form>
      </div>
      <Modal
        centered
        opened={opened}
        onClose={close}
        size="md"
        scrollAreaComponent={ScrollArea.Autosize}
        title={"Add Milestone steps"}
      >
        <h2></h2>
        <form onSubmit={handleFormSubmit}>
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

          <div className="d-flex justify-content-end mt-3">
            <Button
              type="submit"
              sx={{
                backgroundColor: "#db9651",
                "&:hover": { backgroundColor: "#d28b13" },
              }}
              variant="filled"
              mb="md"
            >
              add step
            </Button>
          </div>
        </form>
      </Modal>
    </Fade>
  );
};

export default CreateMilestone;
