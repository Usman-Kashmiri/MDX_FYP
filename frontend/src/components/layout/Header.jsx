import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/Logo.svg";
import { headerNavigation } from "../../data/data";
import UserSettingsDropdown from "../UserSettingsDropdown";
import { useDisclosure } from "@mantine/hooks";
import { Burger } from "@mantine/core";
import { ChatIcon } from "../../pages/DashboardLayout";
import { useAsideContext } from "../../contexts/AsideContext";
import {
  CloseDrawerIcon,
  DrawerHamBurger,
  OpenDrawerIcon,
} from "../../assets/icons/DrawerHamBurgers";

const Header = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const [opened, { toggle }] = useDisclosure(false);
  const { isAsideOpened, toggleAside, closeAside } = useAsideContext() ?? {};

  return (
    <Navbar
      expand={"lg"}
      sticky="top"
      className={`${
        location.pathname.includes("/legal-professionals")
          ? "finder-lawyer-header"
          : ""
      } header py-md-3 bg-white`}
    >
      <Container
        style={{
          background: opened ? "white" : "",
        }}
      >
        {/* // ? toggle btn for find lawyer aside */}
        {location.pathname.includes("/legal-professionals") && (
          <DrawerHamBurger
            Icon={isAsideOpened ? CloseDrawerIcon : OpenDrawerIcon}
            color="#D5AA6D"
            size={30}
            onClick={toggleAside}
            className="drawer-icon me-3 cursor-pointer"
          />
        )}

        {(location.pathname === "/" ||
          location.pathname === "/contact-us" ||
          location.pathname === "/faqs" ||
          location.pathname === "/practice-areas" ||
          location.pathname === "/client-profile" ||
          location.pathname === "/about-us") && (
          <Navbar.Brand className="col-lg-2 col-6" href="/">
            <img src={logo} className="brand-logo" alt="lawyer" />
          </Navbar.Brand>
        )}
        <div
          className={`${
            location?.pathname?.includes("/lawyer") && "w-100"
          } d-lg-none d-flex gap-3 justify-content-between align-items-center col-auto`}
        >
          <Navbar.Toggle
            as={Burger}
            color="#D5AA6D"
            opened={opened}
            onClick={() => {
              toggle();
            }}
          />
          {token && <UserSettingsDropdown />}
        </div>
        <Navbar.Collapse
          id="navbar-nav"
          className={`justify-content-between mt-lg-0 mt-3 gap-xl-3 ${
            opened ? "show" : "" // Apply "show" class if collapseOpen is true
          }`}
        >
          <NavLinks location={location} opened={opened} toggle={toggle} />{" "}
          {/* Pass closeCollapse function */}
          {!token && !location.pathname.includes("auth") && (
            <div className="d-flex gap-3 justify-content-lg-end justify-content-center">
              <button
                className="loginbtn authbtns"
                onClick={() => {
                  navigate("/auth/login");
                }}
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/auth/signup");
                }}
                className="joinbtn authbtns"
              >
                Join
              </button>
            </div>
          )}
        </Navbar.Collapse>
        <div className="d-lg-block d-none">
          {token && <UserSettingsDropdown />}
        </div>
      </Container>
      <ChatIcon />
    </Navbar>
  );
};

export default Header;

export const NavLinks = ({
  location = null,
  opened = false,
  toggle = () => {},
}) => {
  return (
    <Navbar.Toggle className="d-block" onClick={toggle}>
      <Nav
        className={`navigation d-flex justify-content-between align-items-lg-center align-items-start ${
          location ? "gap-xl-4" : ""
        } gap-xl-4 gap-lg-3 gap-md-3 gap-2`}
      >
        {headerNavigation?.map((nav, i) => {
          return (
            <Link
              to={nav?.path}
              className={`nav-link p-0 font-poppins text-capitalize ${
                location?.pathname === nav?.path && " text-dark-color active"
              }`}
              key={i}
            >
              {nav?.name}
            </Link>
          );
        })}
      </Nav>
    </Navbar.Toggle>
  );
};
