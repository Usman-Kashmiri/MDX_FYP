import React from "react";
import { Container } from "react-bootstrap";
import DataTableWithActions from "../../components/admin/DataTableWithActions";
import { useSelector } from "react-redux";
import {
  addPractice,
  deletePractice,
  fetchPracticeList,
  updatePractice,
} from "../../redux/actions/adminActions";

import Fade from 'react-reveal/Fade'; 
const Expertise = () => {
  const { practice } = useSelector((state) => state.admin);

  return (
    <Fade > 
    <Container fluid className="pb-md-5 pb-0 mb-md-5 px-md-4 px-3">
      <DataTableWithActions
        data={practice}
        fetchDispatch={fetchPracticeList}
        addDispatch={addPractice}
        updateDispatch={updatePractice}
        deleteDispatch={deletePractice}
        buttonText="Add Area of Practice"
      />
    </Container>
    </Fade>
  );
};

export default Expertise;
