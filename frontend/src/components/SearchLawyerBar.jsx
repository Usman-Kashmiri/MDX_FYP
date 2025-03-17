import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserSettingsDropdown from "./UserSettingsDropdown";
import { Indicator, Tooltip } from "@mantine/core";
import { UseGetRole } from "../hooks/auth";
import { NavLinks } from "./layout/Header";
import { trimString } from "../helpers/helpers";
import { FaRegBell } from "react-icons/fa";
import { useSelector } from "react-redux";

const SearchLawyerBar = () => {
  const role = UseGetRole();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const { unread_count } = useSelector((state) => state?.notification);

  return (
    <Container
      fluid
      className="search-lawyer-header bg-white p-4 ps-xl-4 ps-5 hi-there-it-is-necessary "
    >
      <div className=" d-flex gap-3 align-items-center justify-content-between justify-content-end text-dark-color">
        <div>
          <div className="navLinks-width">
            <NavLinks />
          </div>
        </div>
        {token ? (
          <div className={`d-flex justify-content-end underdivHAHA mt-0`}>
            <div className="d-flex flex-wrap-reverse align-items-center gap-5 pe-3 justify-content-end">
              <div className="d-flex align-items-center gap-3">
                {(role === "Client" || role === "Lawyer") && (
                  <Link
                    className={`notify-bell ${
                      location.pathname.includes("notifications")
                        ? "activeTab"
                        : ""
                    }`}
                    to={`/${role
                      .toLowerCase()
                      .replace("super", "")}/notifications`}
                    style={{ color: "unset" }}
                  >
                    {unread_count > 0 ? (
                      <Indicator
                        color={"#db9753;"}
                        label={unread_count}
                        size={14}
                      >
                        <FaRegBell className="bell-icon" size={20} />
                      </Indicator>
                    ) : (
                      <FaRegBell className="bell-icon" size={20} />
                    )}
                  </Link>
                )}
                <span className="d-lg-flex d-none flex-column align-items-center">
                  <span className="user-role font-poppins text-capitalize">
                    {role}
                  </span>
                  <Tooltip
                    color="#d5aa6d"
                    withArrow
                    label={`${user?.first_name} ${user?.last_name}`}
                    display={
                      trimString(`${user?.first_name} ${user?.last_name}`)
                        .length > 15
                        ? "flex"
                        : "none"
                    }
                  >
                    <span className="font-poppins text-break username fw-bold text-center text-capitalize">
                      {trimString(`${user?.first_name} ${user?.last_name}`)}
                    </span>
                  </Tooltip>
                </span>
                <UserSettingsDropdown />
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex gap-3 ms-lg-3 justify-content-center">
            <button
              className="loginbtn authbtns rounded-1"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth/signup")}
              className="joinbtn authbtns rounded-1"
            >
              Join
            </button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default SearchLawyerBar;
