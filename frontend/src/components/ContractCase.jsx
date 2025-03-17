import React from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ContractCase = ({ data }) => {
  const navigate = useNavigate();

  const handleClickOfDetails = (id) => {
    navigate(`/dashboard/contract-details/${id}`);
  };

  return (
    <>
      <Col
        xs={12}
        className="client py-3 px-4 d-flex flex-wrap gap-3 align-items-center justify-content-between position-relative"
      >
        <div className="d-flex gap-5 align-items-center --sadas--">
          <div className="d-flex gap-3 align-items-center">
            <span className="d-flex flex-column">
              <span
                className="client-name font-poppins cursor-pointer"
                onClick={(e) => {
                  handleClickOfDetails(data?.id);
                }}
              >
                {data?.title}
              </span>
              <Link
                to={`/dashboard/contract-details/${data?.id}`}
                className="case-description-btn"
              >
                Contract Details
                <i className="fa fa-chevron-right"></i>
              </Link>
            </span>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div style={{ minWidth: "150px" }}>
              <span className="font-poppins grey-label">Contract type</span>
              <br />
              <span className="font-poppins">{data?.type}</span>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ContractCase;
