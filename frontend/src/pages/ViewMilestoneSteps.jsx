import { Stepper, Text } from "@mantine/core";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const ViewMilestoneSteps = ({ selectedStage = {}, index = 0 }) => {
  const [selectedStep, setSelectedStep] = useState({});
  const [activeStage, setActiveStage] = useState(1);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [index]);

  return (
    <div className="p-md-5 p-3 px-2 box-of-milestone">
      <div className="d-flex justify-content-center align-items-center w-100 mb-3"></div>
      <div className="d-flex justify-content-between align-items-center w-100 mb-3">
        {/* <h2 className="mb-0 text-of-transaction">Stage {index}</h2> */}
      </div>
      <div className="seperator-of-milestone"></div>
      <div className="box-of-stage-stepper">
        {selectedStage?.length > 0 && (
          <Stepper
            activeStage={activeStage}
            onStepClick={setActiveStage}
            breakpoint="sm"
            orientation="horizontal"
          >
            {selectedStage?.map((item, i) => {
              return (
                <Stepper.Step
                  label={
                    <Text
                      onClick={() => {
                        setSelectedStep(item);
                        setSelectedIndex(i + 1);
                      }}
                      className={`${
                        selectedIndex === i + 1 && "selected-milstone"
                      }`}
                    >{`Step ${i + 1}`}</Text>
                  }
                  description={
                    <Text
                      onClick={() => {
                        setSelectedStep(item);
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
      {selectedStep?.id && (
        <>
          <div className="mt-3">
            <span className="span-head-label-for-milestone">Name</span>
            <br />
            <span>{selectedStep?.name}</span>
          </div>
          <div className="mt-3">
            <span className="span-head-label-for-milestone">Description</span>
            <br />
            <span>{selectedStep?.description}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewMilestoneSteps;
