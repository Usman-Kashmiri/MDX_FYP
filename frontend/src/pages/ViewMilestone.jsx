import {
  Button,
  HoverCard,
  Input,
  Modal,
  ScrollArea,
  Stepper,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMilestoneStep,
  getMilestoneStageWithSteps,
} from "../redux/actions/lawyerAction";
import { fetchMilestoneStages } from "../redux/actions/clientActions";
import ViewMilestoneSteps from "./ViewMilestoneSteps";
import { useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

const ViewMilestone = ({ contractId = null }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const role = JSON.parse(localStorage.getItem("user")).role;
  const isLawyer = role === "Lawyer";
  const isClient = role === "Client";
  const dispatch = useDispatch();
  const { milestoneStages, loading } = useSelector((state) =>
    isLawyer ? state?.lawyer : isClient && state?.client
  );
  const [stages, setStages] = useState([]);
  // const [selectedStages, setSelectedStage] = useState([]);
  const [selectedStage, setSelectedStage] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeStage, setActiveStage] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    if (isLawyer) {
      dispatch(getMilestoneStageWithSteps(id));
    } else if (isClient) {
      dispatch(fetchMilestoneStages(id));
    }
  }, []);

  useEffect(() => {
    setStages(milestoneStages);
  }, [milestoneStages]);

  const form = useForm({
    initialValues: { name: "", description: "" },
    validate: {
      name: (value) => (value ? null : "Invalid name"),
      description: (value) => (value ? null : "Invalid description"),
    },
  });

  const handleSteps = async (values) => {
    const data = { ...values, stage_id: selectedStage };
    const res = await dispatch(createMilestoneStep(data));
    if (res?.res === "success") {
      dispatch(getMilestoneStageWithSteps(id));
      form?.reset();
      close();
    }
  };
  return (
    <div className="w-100">
      <div className="seperator-of-milestone"></div>

      {/* <div className="box-of-stage-stepper">
        {stages?.length > 0 && (
          <Stepper
            activeStage={activeStage}
            onStepClick={setActiveStage}
            breakpoint="sm"
            orientation="horizontal"
          >
            {stages?.map((item, i) => {
              return (
                <Stepper.Step
                  label={
                    <HoverCard width={280} shadow="md">
                      <HoverCard.Target>
                        <Text
                          onClick={() => {
                            setSelectedStage(item);
                            setSelectedIndex(i + 1);
                          }}
                          className={`${
                            selectedIndex === i + 1 && "selected-milstone"
                          }`}
                        >{`Stage ${i + 1}`}</Text>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        {item?.description}
                      </HoverCard.Dropdown>
                    </HoverCard>
                  }
                  description={
                    <Text
                      onClick={() => {
                        setSelectedStage(item);
                        setSelectedIndex(i + 1);
                      }}
                    >{`${item?.name}`}</Text>
                  }
                  key={i}
                  style={{
                    cursor: "pointer",
                  }}
                ></Stepper.Step>
              );
            })}
          </Stepper>
        )}
      </div>

      {selectedStage?.id && (
        <>
          <div className="mt-3">
            <span className="span-head-label-for-milestone">Name</span>
            <br />
            <span>{selectedStage?.name}</span>
          </div>
          <div className="mt-3">
            <span className="span-head-label-for-milestone">Description</span>
            <br />
            <span>{selectedStage?.description}</span>
          </div>
        </>
      )}

      {selectedStage?.id && (
        <ViewMilestoneSteps
          selectedStage={selectedStage?.steps}
          index={selectedIndex}
        />
      )} */}
      {stages?.length > 0 &&
        stages?.map((value, i) => {
          return (
            <div key={i}>
              <div className="d-flex justify-content-between">
                <h5 className="mb-0 text-capitalize">{value?.name}</h5>
                {role === "Lawyer" && (
                  <Button
                    onClick={() => {
                      open();
                      setSelectedStage(value?.id);
                    }}
                    className=" primary-btn"
                  >
                    Add Steps
                  </Button>
                )}
              </div>
              <p className="text-capitalize mb-4">{value?.description}</p>
              <ul>
                {value?.steps?.length > 0 &&
                  value?.steps?.map((steps, j) => {
                    return (
                      <li key={j}>
                        <strong className="text-capitalize">
                          {steps?.name}
                        </strong>
                        <p className="text-capitalize">{steps?.description}</p>
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
      <Modal
        centered
        opened={opened}
        onClose={close}
        size="md"
        scrollAreaComponent={ScrollArea.Autosize}
        title={"Add Milestone Steps"}
      >
        <h2></h2>
        <form onSubmit={form.onSubmit(handleSteps)}>
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
            // required
            scrollAreaComponent={ScrollArea.Autosize}
            label="Description"
            autosize
            minRows={5}
            // maxRows={"auto"}
            withAsterisk
            {...form.getInputProps("description")}
          />

          <div className="d-flex justify-content-end mt-3">
            <Button
              loading={loading}
              disabled={loading}
              type="submit"
              sx={{
                backgroundColor: "#db9651",
                "&:hover": { backgroundColor: "#d28b13" },
              }}
              variant="filled"
              mb="md"
            >
              Add Steps
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ViewMilestone;
