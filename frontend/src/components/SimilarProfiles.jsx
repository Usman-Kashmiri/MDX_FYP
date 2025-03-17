import React from "react";
import { Link } from "react-router-dom";
import userImg from "../assets/images/user-profile-picture.png";

const SimilarProfiles = () => {
  const no_of_users = [1, 2, 3, 4];

  return (
    <div className="similar-profiles">
      <span className="top text-uppercase font-raleway">similar profiles</span>
      {no_of_users.map((user, i) => {
        return (
          <div key={i} className="similar-user">
            <img src={userImg} alt="user" className="w-100 rounded-circle" />
            <span>
              <span className="name text-uppercase font-montserrat">
                ARNOLD ZOET
              </span>

              {/* // * if you ever need to add bio or something similar uncomment this */}
              {/* <span className="d-flex flex-column">
                <span className="degree-heading font-poppins"></span>
                <span className="degree font-poppins"></span>
              </span> */}
            </span>
          </div>
        );
      })}
      <Link
        to=""
        className="more-icon fw-bold text-dark-color text-decoration-none font-montserrat mt-3 d-flex gap-2 align-items-center"
      >
        More
        <svg width="28" height="24" viewBox="0 0 8 4" fill="none">
          <path
            d="M7.5 2L5 0.556624V3.44338L7.5 2ZM0 2.25H5.25V1.75H0V2.25Z"
            fill="#D5AA6D"
          />
        </svg>
      </Link>
    </div>
  );
};

export default SimilarProfiles;
