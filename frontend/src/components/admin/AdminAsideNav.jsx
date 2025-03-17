import { NavLink } from "@mantine/core";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { adminAsideNavigation } from "../../data/data";
import { UseGetRole } from "../../hooks/auth";

const AdminAsideNav = ({ close = null }) => {
  const location = useLocation();
  const role = UseGetRole()?.toLowerCase();

  return adminAsideNavigation?.map(
    (item, index) =>
      item.allow.includes(role) && (
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
              {role === "superadmin" && (
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
              )}
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
            <Link
              to={item.path}
              onClick={close}
              className="text-decoration-none"
            >
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
      )
  );
};

export default AdminAsideNav;
