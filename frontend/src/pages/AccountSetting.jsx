import { Button, Switch, Tabs, Text } from "@mantine/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileTabContent from "../components/ProfileTabContent";
import { useMediaQuery } from "@mantine/hooks";
import Fade from "react-reveal/Fade";
import { UseGetProvider, UseGetRole } from "../hooks/auth";
import AvailabilityLawyer from "../components/AvailabilityLawyer";
import { changeEmailNotification } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import custAxios, { attachToken } from "../services/axiosConfig";
import { logout } from "../redux/actions/authActions";
import { successMessage } from "../globalFunctions";

const AccountSetting = () => {
  const dispatch = useDispatch();
  const role = UseGetRole();
  const provider = UseGetProvider();
  const smallScreen = useMediaQuery("(max-width: 767px)");
  const { userData } = useSelector((state) => state?.auth?.user);
  const [isNotificationEnabled, setNotificationEnabled] = useState(
    Number(userData?.email_notifications)
  );
  const [isDeactivationLoading, setDeactivationLoading] = useState(false);

  // ? deactivation modal
  const openDeactivationModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action!",
      children: (
        <Text size="lg" fw={600} mb={40}>
          Are you sure you want to deactivate your account?. This action will
          temporarily deactivate your account and you activate your account
          anytime with an OTP verification!
        </Text>
      ),
      centered: true,
      labels: { confirm: "Proceed", cancel: "Cancel" },
      confirmProps: {
        color: "red",
        loading: isDeactivationLoading,
      },
      onConfirm: () => handleDeactivation(),
    });

  // ? deactivavtion handler
  const handleDeactivation = async () => {
    setDeactivationLoading(true);
    try {
      attachToken();
      const res = await custAxios.put("/auth/deactivate-account");
      setDeactivationLoading(false);
      if (res.data.success) {
        successMessage(res?.data?.message);
        setTimeout(() => {
          dispatch(logout());
        }, 1500);
      }
    } catch (error) {
      setDeactivationLoading(false);
      console.error(error);
    }
  };

  // ? switch email notifications on/off handler
  const handleNotificationSwitch = async (value) => {
    try {
      setNotificationEnabled(value);
      await dispatch(changeEmailNotification(role, value));
    } catch (error) {
      setNotificationEnabled(!value);
      console.error(error);
    }
  };

  return (
    <Fade>
      <div className="p-md-5 p-3 account-setting">
        <h2>Account Setting</h2>
        <Tabs
          color="orange"
          variant="pills"
          radius="xl"
          orientation={!smallScreen ? "vertical" : "horizontal"}
          defaultValue="account"
          className="mt-5"
        >
          <Tabs.List className="pb-4">
            <Tabs.Tab value="account">Account</Tabs.Tab>
            <Tabs.Tab value="notification">Notifications</Tabs.Tab>
            <Tabs.Tab value="payment-method">Payment Method</Tabs.Tab>
            {role === "Lawyer" ? (
              <Tabs.Tab value="availability">Availability</Tabs.Tab>
            ) : null}
            <Button
              p={0}
              sx={{
                height: "fit-content",
                width: "fit-content",
                fontSize: "1rem",
              }}
              onClick={openDeactivationModal}
              variant="white"
              className="ms-3 mt-4 delete-account-link"
            >
              Deactivate Account
            </Button>
          </Tabs.List>

          <Tabs.Panel value="account" pl="xs" pt="lg">
            <ProfileTabContent />
          </Tabs.Panel>

          <Tabs.Panel value="notification" pl="xs" pt="lg">
            <p className="fw-bold fs-4">Notifications Settings</p>
            <div>
              <div className="d-flex justify-content-lg-between mt-2">
                <label>
                  Switch on the email notification if you want to receive
                  notification via email.
                </label>
                <Switch
                  className="notification-switch"
                  size="lg"
                  checked={isNotificationEnabled}
                  // onChange={(event) => {
                  //   const value = event.currentTarget.checked ? 1 : 0;
                  //   dispatch(changeEmailNotification(role, value));
                  // }}
                  onChange={(event) =>
                    handleNotificationSwitch(
                      event.currentTarget.checked ? 1 : 0
                    )
                  }
                />
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="payment-method" pl="xs" pt="lg">
            Tax information tab content
          </Tabs.Panel>
          <Tabs.Panel value="availability" pl="xs" pt="lg">
            <AvailabilityLawyer />
          </Tabs.Panel>
        </Tabs>
      </div>
    </Fade>
  );
};

export default AccountSetting;
