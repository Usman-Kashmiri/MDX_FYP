import React, { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { Avatar, Box, Burger, NavLink } from "@mantine/core";
import { getUserData } from "../hooks/auth";
import { Link, useLocation } from "react-router-dom";
import { HandleLogoutContext } from "../pages/DashboardLayout";
import { AiOutlinePhone, AiTwotoneHome } from "react-icons/ai";
import { FaQuestionCircle } from "react-icons/fa";
import { SiAboutdotme } from "react-icons/si";
import { BiUserCircle } from "react-icons/bi";
import { adminAsideNavigation } from "../data/data";

const AdminAside = ({ handleMenuBtn, opened, close }) => {
  const handleLogout = useContext(HandleLogoutContext);

  const userData = getUserData();

  return (
    <div className="dashboard-aside d-flex flex-column justify-content-between align-items-center py-4 px-4 gap-5">
      <span className="aside-toggler d-xl-none position-absolute mt-2">
        <Burger color="#D5AA6D" opened={opened} onClick={handleMenuBtn} />
      </span>
      <Row className="flex-column w-100 h-100">
        <Col
          xs={12}
          className="d-flex flex-column align-items-center justify-content-center mt-2 px-3 position-relative aside-user-profile-pic"
        >
          <Avatar src={userData?.image} alt="user" size={135} radius={200} />
          <div className="details d-flex flex-column mt-3">
            <h2 className="font-poppins">{`${userData?.first_name} ${userData?.last_name}`}</h2>
          </div>
        </Col>
        <Col xs={12} className="mt-3 px-0 admin-aside-navigation">
          <Navigation close={close} />
        </Col>
      </Row>
      <button
        onClick={handleLogout}
        className="primary-btn align-items-center mt-4 text-capitalize d-flex gap-2 ps-2 pe-5 align-self-start"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="#db9651"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.7 22.0039L10.3 22.0039C13.5 22.0039 15.5 20.0039 15.5 16.8039V12.7539L9.25 12.7539C8.84 12.7539 8.5 12.4139 8.5 12.0039C8.5 11.5939 8.84 11.2539 9.25 11.2539L15.5 11.2539V7.20391C15.5 4.00391 13.5 2.00391 10.3 2.00391L7.71 2.00391C4.51 2.00391 2.51 4.00391 2.51 7.20391L2.51 16.8039C2.5 20.0039 4.5 22.0039 7.7 22.0039Z"
            fill="currentColor"
          />
          <path
            d="M19.9405 12.7539L17.8705 14.8239C17.7205 14.9739 17.6505 15.1639 17.6505 15.3539C17.6505 15.5439 17.7205 15.7439 17.8705 15.8839C18.1605 16.1739 18.6405 16.1739 18.9305 15.8839L22.2805 12.5339C22.5705 12.2439 22.5705 11.7639 22.2805 11.4739L18.9305 8.12388C18.6405 7.83388 18.1605 7.83388 17.8705 8.12388C17.5805 8.41388 17.5805 8.89388 17.8705 9.18388L19.9405 11.2539L15.5005 11.2539V12.7539L19.9405 12.7539Z"
            fill="currentColor"
          />
        </svg>
        Logout
      </button>
    </div>
  );
};

const Navigation = ({ close }) => {
  const location = useLocation();

  const items = adminAsideNavigation?.map((item, index) => (
    <div key={index}>
      {item?.label === "Manage Users" ? (
        <NavLink
          key={index}
          label={item.label}
          description={item.description}
          rightSection={item.rightSection}
          icon={item.icon}
          childrenOffset={28}
          active={
            location.pathname === "/admin/moderators" ||
            location.pathname === "/admin/lawyers" ||
            location.pathname === "/admin/clients"
          }
        >
          <Link
            to={"/admin/moderators"}
            onClick={close}
            className="text-decoration-none"
          >
            <NavLink
              label="Manage Moderators"
              active={location.pathname === "/admin/moderators"}
            />
          </Link>
          <Link
            to={"/admin/lawyers"}
            onClick={close}
            className="text-decoration-none"
          >
            <NavLink
              label="Manage Lawyers"
              active={location.pathname === "/admin/lawyers"}
            />
          </Link>
          <Link
            to={"/admin/clients"}
            onClick={close}
            className="text-decoration-none"
          >
            <NavLink
              label="Manage Clients"
              active={location.pathname === "/admin/clients"}
            />
          </Link>
        </NavLink>
      ) : (
        <Link to={item.path} onClick={close} className="text-decoration-none">
          <NavLink
            active={location.pathname === item.path}
            label={item.label}
            description={item.description}
            rightSection={item.rightSection}
            icon={item.icon}
          />
        </Link>
      )}
    </div>
  ));

  return (
    <Box w="100%">
      {items}
      <div className="is-showable-in-account-setting-aside">
        <SideLinks />
      </div>
    </Box>
  );
};

export default AdminAside;

const SideLinks = () => {
  return (
    <>
      <li>
        <Link to={"/"} className="text-decoration-none">
          <NavLink
            active={window.pathname === "/"}
            label={"Home"}
            icon={<AiTwotoneHome />}
          />
        </Link>
      </li>
      <li>
        <Link to={"/about-us"} className="text-decoration-none">
          <NavLink
            active={window.pathname === "/about-us"}
            label={"About"}
            icon={<SiAboutdotme />}
          />
        </Link>
      </li>
      <li>
        <Link to={"/legal-professionals"} className="text-decoration-none">
          <NavLink
            active={window.pathname === "/legal-professionals"}
            label={"Attorney"}
            icon={<BiUserCircle />}
          />
        </Link>
      </li>
      <li>
        <Link to={"/contact-us"} className="text-decoration-none">
          <NavLink
            active={window.pathname === "/contact-us"}
            label={"Contact"}
            icon={<AiOutlinePhone />}
          />
        </Link>
      </li>
      <li>
        <Link to={"/faqs"} className="text-decoration-none">
          <NavLink
            active={window.pathname === "/faqs"}
            label={"FAQ"}
            icon={<FaQuestionCircle />}
          />
        </Link>
      </li>
    </>
  );
};
