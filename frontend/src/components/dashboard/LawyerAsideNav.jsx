import React from "react";
import { NavLink } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { lawyerAsideNavigation } from "../../data/data";

const LawyerAsideNav = ({ close }) => {
  const { pathname } = useLocation();

  return lawyerAsideNavigation?.map((item, index) => (
    <div key={index}>
      <Link to={item.link} onClick={close} className="text-decoration-none">
        <NavLink
          active={pathname === item.link}
          label={item.label}
          icon={<item.icon />}
        />
      </Link>
    </div>
  ));
};

export default LawyerAsideNav;
