import React from "react";
import logo from "../../assets/images/Logo.svg";
import userImg from "../../assets/images/user-profile-picture.png";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Indicator } from "@mantine/core";

const IconsAside = () => {
  const role = JSON.parse(localStorage.getItem("user")).role;
  const navigate = useNavigate();
  const userImageUrl = JSON.parse(localStorage.getItem("user"))?.image;
  return (
    <div className="py-4 px-sm-2 d-flex flex-column justify-content-between align-items-center min-vh-100">
      <div>
        <img
          src={logo}
          alt="logo"
          style={{ aspectRatio: "1/1", maxWidth: "60px", minWidth: "35px" }}
          className="w-100 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <div className="tabs d-flex gap-2 flex-column">
        <Link to={`/${role.toLowerCase()}/account-settings`}>
          <i className="fa fa-gear cursor-pointer"></i>
        </Link>
        <Link to={`/${role.toLowerCase()}/appointments`}>
          <i className="fa fa-clock cursor-pointer"></i>
        </Link>
        <Link to={`/${role.toLowerCase()}/dashboard`}>
          <i className="fa fa-chart-line cursor-pointer"></i>
        </Link>
        <Link to={`/${role.toLowerCase()}/contracts`}>
          <i className="fa-solid fa-file-signature"></i>
        </Link>
        <Link to={"/chat"}>
          <i className="fa fa-envelope-open active-tab cursor-pointer"></i>
        </Link>
      </div>
      <div>
        <Link to={`/${role.toLowerCase()}/dashboard`}>
          <Indicator
            inline
            size={16}
            offset={7}
            position="bottom-end"
            color={"green"}
            withBorder
          >
            <Avatar
              src={userImageUrl}
              alt="user-avatar"
              size={"3rem"}
              radius={"xl"}
            />
          </Indicator>
        </Link>
      </div>
    </div>
  );
};

export default IconsAside;
