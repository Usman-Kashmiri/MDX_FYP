import React, { createContext, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Fade from "react-reveal/Fade";
import { Burger } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { UseGetRole } from "../hooks/auth";
import { logout } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineWechat } from "react-icons/ai";
import SearchLawyerBar from "../components/SearchLawyerBar";
import DashboardAside from "../components/dashboard/DashboardAside";
import { fetchUnreadMessage } from "../redux/actions/chatActions";

export const HandleLogoutContext = createContext();

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { socket } = useSelector((store) => store.web);
  const { unreadMessages } = useSelector((store) => store.chat);

  const [opened, { toggle, close }] = useDisclosure(false);
  const screen_1200 = useMediaQuery("(max-width: 1200px)");
  const role = UseGetRole();
  const handleMenuBtn = () => {
    toggle();
  };

  const handleLogout = async () => {
    socket.emit("logout");
    navigate("/");
    await dispatch(logout());
  };

  return (
    <HandleLogoutContext.Provider value={handleLogout}>
      <Fade>
        <div
          className={`dashboard-body position-relative ${
            opened ? "max-vh-100 max-vw-100" : ""
          }`}
        >
          <span
            className="aside-toggler xl-screen-none position-absolute"
            style={{ margin: "1.6rem 1.6rem" }}
          >
            <Burger color="#D5AA6D" opened={opened} onClick={toggle} />
          </span>
          <div className={`aside-container ${opened ? "active" : ""}`}>
            <DashboardAside
              handleMenuBtn={handleMenuBtn}
              opened={opened}
              close={close}
            />
          </div>
          {opened && screen_1200 && (
            <div className="aside-overlay" onClick={close}></div>
          )}
          <Container
            fluid
            className="py-xs-3 py-2 ps-xl-0 px-xs-3 px-2 h-100 min-vh-100"
          >
            <div className="content-white-container h-100">
              <div className="dashboard-navigation search-bar position-sticky top-0">
                <SearchLawyerBar />
              </div>
              <div className="outlet pt-4">
                <Outlet />
              </div>
            </div>
          </Container>
        </div>
      </Fade>

      <ChatIcon count={unreadMessages} />
    </HandleLogoutContext.Provider>
  );
};

export const ChatIcon = ({ count }) => {
  const role = UseGetRole();

  return (
    <>
      {(role === "Lawyer" || role === "Client") && (
        <div className="chat-icon-container">
          <Link to={"/chat"}>
            <button className="chat-icon-button">
              {count > 0 && <span className="unread-count">{count}</span>}
              <AiOutlineWechat style={{ fontSize: "30px", color: "white" }} />
            </button>
          </Link>
        </div>
      )}
    </>
  );
};
