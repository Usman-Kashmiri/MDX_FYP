import React from "react";
import AdminAsideNav from "../admin/AdminAsideNav";
import { headerNavigation } from "../../data/data";
import { Link, useLocation } from "react-router-dom";
import { Box, NavLink } from "@mantine/core";
import { UseGetRole } from "../../hooks/auth";
import LawyerAsideNav from "./LawyerAsideNav";
import ClientAsideNav from "./ClientAsideNav";

const AsideNavigation = ({ close }) => {
  const { pathname } = useLocation();
  const role = UseGetRole();
  return (
    <Box w="100%">
      {role === "SuperAdmin" || role === "Admin" ? (
        <AdminAsideNav close={close} />
      ) : role === "Lawyer" ? (
        <LawyerAsideNav close={close} />
      ) : (
        <ClientAsideNav close={close} />
      )}
      <div className="is-showable-in-account-setting-aside">
        {headerNavigation?.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            onClick={close}
            className="text-decoration-none"
          >
            <NavLink
              active={pathname === item.path}
              label={item.name}
              icon={<item.icon />}
            />
          </Link>
        ))}
      </div>
    </Box>
  );
};

export default AsideNavigation;
