import React from "react";
import { NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UseGetRole, getUserData } from "../hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions";
import { Avatar } from "@mantine/core";
import { RiDashboardFill } from "react-icons/ri";
const UserSettingsDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.web);

  const role = UseGetRole();
  const userData = getUserData();

  const handleLogout = async () => {
    socket.emit("logout");
    navigate("/");
    await dispatch(logout());
  };

  return (
    <div className="dropdown-container me-1  user-settings-btn d-flex justify-content-end position-relative">
      <NavDropdown
        title={
          <div className="d-inline-flex">
            <Avatar src={userData?.image} alt="user" size={46} radius={"xl"} />
          </div>
        }
        id="nav-dropdown"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="rgba(0, 0, 0, 0.175)"
          className="dropdown-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
        <NavDropdown.Item className="d-flex align-items-center gap-2">
          <div className="d-inline-flex">
            <Avatar src={userData?.image} alt="user" size={40} radius={"xl"} />
          </div>
          <span className="d-inline-flex w-100 overflow-hidden flex-column justify-content-center">
            <span className="font-poppins text-break username nav-username w-100 text-capitalize">{`${userData?.first_name} ${userData?.last_name}`}</span>
            <span className="font-poppins text-break email">
              {userData?.email?.length > 20
                ? `${userData?.email?.slice(0, 16)}...`
                : userData?.email}
            </span>
          </span>
        </NavDropdown.Item>
        <NavDropdown.Divider />
        {role === "Lawyer" && (
          <Link
            to={"/lawyer-profile"}
            className="d-flex gap-3 align-items-center dropdown-item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                fill="#1D1D1D"
                fillRule="evenodd"
                d="M8.93.655A8.278 8.278 0 00.655 8.93a8.278 8.278 0 008.275 8.275 8.278 8.278 0 008.275-8.275A8.278 8.278 0 008.93.655zm0 2.482a2.48 2.48 0 012.482 2.483A2.48 2.48 0 018.93 8.102 2.48 2.48 0 016.447 5.62 2.48 2.48 0 018.93 3.137zm0 11.75a5.958 5.958 0 01-4.965-2.664c.025-1.646 3.31-2.548 4.965-2.548 1.647 0 4.94.902 4.965 2.548a5.958 5.958 0 01-4.965 2.665z"
                clipRule="evenodd"
              ></path>
            </svg>
            My Profile
          </Link>
        )}
        <Link
          to={`/${
            role ? role?.replace("Super", "")?.toLowerCase() : ""
          }/dashboard`}
          className="d-flex gap-3 align-items-center dropdown-item"
        >
          <RiDashboardFill />
          Dashboard
        </Link>
        <Link
          to={`/${
            role ? role?.replace("Super", "")?.toLowerCase() : ""
          }/account-settings`}
          className="d-flex gap-3 align-items-center dropdown-item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="17"
            fill="none"
            viewBox="0 0 15 17"
          >
            <path
              fill="#000"
              d="M14.136 9.736l-.303-.184a1.215 1.215 0 01-.576-1.052c0-.439.216-.832.576-1.052l.303-.184c.827-.504 1.11-1.616.632-2.488l-.576-1.052c-.476-.87-1.534-1.169-2.359-.666l-.303.184c-.36.22-.791.22-1.151 0a1.216 1.216 0 01-.576-1.052v-.369C9.803.817 9.028 0 8.076 0H6.925c-.953 0-1.728.817-1.728 1.821v.37c0 .439-.215.831-.575 1.051-.36.22-.791.22-1.152 0l-.302-.184c-.825-.503-1.884-.204-2.36.666L.232 4.776c-.477.872-.195 1.985.632 2.488l.303.184c.36.22.576.613.576 1.052 0 .439-.215.832-.576 1.052l-.302.184c-.827.503-1.11 1.616-.632 2.488l.575 1.052c.477.87 1.536 1.168 2.36.666l.302-.184c.36-.22.791-.219 1.152 0 .36.22.575.613.575 1.052v.369c0 1.004.775 1.821 1.728 1.821h1.151c.952 0 1.727-.817 1.727-1.821v-.37c0-.438.215-.831.576-1.051.36-.22.79-.22 1.151 0l.303.184c.825.502 1.883.203 2.36-.666l.575-1.052c.477-.872.195-1.985-.632-2.488zm-6.636 1.8c-1.587 0-2.878-1.362-2.878-3.036S5.913 5.464 7.5 5.464c1.588 0 2.879 1.362 2.879 3.036S9.088 11.536 7.5 11.536z"
            ></path>
          </svg>
          Setting
        </Link>
        <NavDropdown.Divider />
        <NavDropdown.Item
          onClick={handleLogout}
          className="d-flex gap-3 align-items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="16"
            fill="none"
            viewBox="0 0 14 16"
          >
            <path
              fill="#000"
              d="M9.084 2.017a.517.517 0 10-.32.983A5.888 5.888 0 115.08 3a.517.517 0 10-.32-.983 6.923 6.923 0 104.323 0z"
            ></path>
            <path
              fill="#000"
              d="M6.923 5.963a.517.517 0 00.517-.517V.517a.517.517 0 10-1.034 0v4.929a.517.517 0 00.517.517z"
            ></path>
          </svg>
          Logout
        </NavDropdown.Item>
      </NavDropdown>
    </div>
  );
};

export default UserSettingsDropdown;
