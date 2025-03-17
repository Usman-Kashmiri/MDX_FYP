import React from "react";
import { ProgressBar } from "react-bootstrap";

const SkillProgressBar = ({skill_title, progress}) => {
  return (
    <div className="progress_cont position-relative">
      <div className="skill font-open-sans text-uppercase">
        {skill_title}<span className="pull-right">{progress}%</span>
      </div>
      <ProgressBar now={progress} />
    </div>
  );
};

export default SkillProgressBar;
