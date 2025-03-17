import React from "react";
import { FaStar } from "react-icons/fa";

const Ratings = ({ ratings }) => {
  const stars = [];

  // Create an array of 5 stars
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar key={i} className={i < Math.round(ratings) ? "filled" : ""} />
    );
  }

  return (
    <span className="d-flex align-items-center gap-3">
      <span className="fw-semibold font-poppins">
        <span className="rating-average fw-semibold">{ratings}</span>/
        <sub className="fw-semibold">5</sub>
      </span>
      <span className="d-flex gap-1">{stars}</span>
    </span>
  );
};

export default Ratings;
