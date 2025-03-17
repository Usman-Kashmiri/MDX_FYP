import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import FindLawyer from "../pages/FindLawyer";
import ChatLayout from "../pages/ChatLayout";
import VerifyAccount from "../components/VerifyAccount";
import About from "../pages/About";
import DefaultLayout from "../pages/DefaultLayout";
import { DashboardLayout } from "../pages/DashboardLayout";
import Dashboard from "../pages/admin/Dashboard";
import Contact from "../pages/Contact";
import LawyerProfile from "../pages/lawyer/LawyerProfile";
import ClientProfile from "../pages/client/ClientProfile";
import FAQs from "../pages/FAQs";
import ResetPassword from "../components/ResetPassword";
import RequestVerificationToken from "../components/RequestVerificationToken";
import LawyerDashboard from "../pages/lawyer/LawyerDashboard";
import LawyerRoute from "./LawyerRoute";
import ClientRoute from "./ClientRoute";
import NotFound from "./NotFound";
import AccountSetting from "../pages/AccountSetting";
import BookAppointment from "../pages/client/BookAppointment";
import CommonRoute from "./CommonRoute";
import AdminRoute from "./AdminRoute";
import Expertise from "../pages/admin/Expertise";
import Jurisdiction from "../pages/admin/Jurisdiction";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageProfile from "../pages/admin/ManageProfile";
import ClientDashboard from "../pages/client/Dashboard";
import ManageModerators from "../pages/admin/ManageModerators";
import ManageLawyers from "../pages/admin/ManageLawyers";
import ManageClients from "../pages/admin/ManageClients";
import VideoMeeting from "../pages/VideoMeeting";
import MeetingStartup from "../pages/MeetingStartup";
import ContractCreation from "../pages/ContractCreation";
import ContractList from "../pages/ContractList";
import ContractDetails from "../pages/ContractDetails";
import AppointmentList from "../pages/lawyer/AppointmentList";
import PaymentPage from "../pages/PaymentPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import Countries from "../pages/admin/Countries";
import Transactions from "../pages/Transactions";
import Wallet from "../pages/Wallet";
import WebSetting from "../pages/admin/WebSetting";
import WithdrawRequests from "../pages/admin/WithdrawRequests";
import AdminFAQs from "../pages/admin/FAQs";
import ContactUsForAdmin from "../pages/admin/ContactUsForAdmin";
import NewsLetter from "../pages/admin/NewsLetter";
import Notification from "../pages/admin/Notification";
import MessageViewForAdmin from "../pages/admin/MessageViewForAdmin";
import UserStatistics from "../pages/admin/UserStatistics";
import CreateMilestone from "../pages/CreateMilestone";
import ViewMilestone from "../pages/ViewMilestone";
import ViewMilestoneSteps from "../pages/ViewMilestoneSteps";
import CarouselPage from "../pages/admin/CarouselPage";
import OnlineUsers from "../pages/testPages/onlineUsers";
import PracticeAreas from "../pages/PracticeAreas";
import PracticeArea from "../pages/PracticeArea";
import AsideProvider from "../contexts/AsideContext";
import CustomChat from "../pages/CustomChat";
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mantine/core";
import {
  fetchUnreadMessage,
  peopleChatList,
} from "../redux/actions/chatActions";
import { pusher } from "../services/pusherConfig";
import { fetchWebDetails } from "../redux/actions/webActions";
import { PusherNotifications } from "../components/pushNotifications/PusherNotifications";
import { countUnredNotifications } from "../redux/actions/notificationsActions";

const Router = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useSelector((store) => store.auth);
  const { socket, webDetails } = useSelector((store) => store.web);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [NotifyData, setNotifyData] = useState([]);
  let currentPageTitle = document.title;
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleVisibilityChange = useCallback(() => {
    setIsTabVisible(document.visibilityState === "visible");
  }, []);

  useEffect(() => {
    dispatch(fetchWebDetails());
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const isClientOrLawyer = ["Client", "Lawyer"].includes(
      user?.userData?.role
    );
    if (isAuthenticated && isClientOrLawyer) {
      dispatch(countUnredNotifications());
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
      socket.emit("join", { token: user.token, user: user.userData });
    } else {
      socket.emit("logout");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    socket.on("newContactUsMessage", ({ username, email }) => {
      if (isAuthenticated && !pathname.includes("/admin/messages")) {
        if (
          user?.userData?.role === "SuperAdmin" ||
          user?.userData?.role === "Admin"
        ) {
          notifications.show({
            id: "msg-notification",
            withCloseButton: true,
            autoClose: 10000,
            title: (
              <span onClick={() => window.open("/admin/messages", "_blank")}>
                A new email message has been received from {username}.
              </span>
            ),
            message: (
              <span onClick={() => window.open("/admin/messages", "_blank")}>
                email: {email}
              </span>
            ),
            color: "#d07d23",
            icon: (
              <Avatar
                src="invalid-link"
                alt="user-profile-image"
                radius={"xl"}
                onClick={() => window.open("/admin/messages", "_blank")}
              />
            ),
            loading: false,
          });
        }
      }
    });
  }, [pathname, user?.userData?.role]);

  // PUSHER CHANNEL SUBSCRIBE AND UPDATE STATES DATA
  useEffect(() => {
    const channel = pusher.subscribe(
      `all-message-channel.${user?.userData?.id}`
    );

    channel.bind(`all-message-event.${user?.userData?.id}`, (data) => {
      if (!user?.userData || !data?.data || !isAuthenticated) return;
      if (data.data[0]) {
        setNotifyData((prevData) => [...prevData, data.data[0]]);
      }
    });

    return () => {
      pusher.unsubscribe(`all-message-channel.${user?.userData?.id}`);
    };
  }, [isAuthenticated, pathname, user, dispatch]);

  // MANAGE REALTIME NOTIFICATION OF APP
  useEffect(() => {
    const isClientOrLawyer = ["Client", "Lawyer"].includes(
      user?.userData?.role
    );
    if (isAuthenticated && isClientOrLawyer) {
      dispatch(countUnredNotifications());
    }
    if (isTabVisible && NotifyData.length > 0 && isAuthenticated) {
      const isChatPage = pathname.includes("chat");

      const isNotChatPage = !pathname.includes("chat");

      if (isChatPage && isClientOrLawyer) {
        dispatch(peopleChatList());
      }

      if (isNotChatPage && isClientOrLawyer) {
        dispatch(fetchUnreadMessage());
      }

      NotifyData.forEach((data, index) => {
        const currentSenderId = isChatPage
          ? Number(pathname.split("/").pop())
          : undefined;

        if (data.sender_id !== currentSenderId) {
          setTimeout(() => {
            let pusherNotify = PusherNotifications(data, user.userData.role);
            notifications.show(pusherNotify);
          }, 200 * index);
        }
      });
      setNotifyData([]);
    }
  }, [isTabVisible, NotifyData, isAuthenticated, pathname, user, dispatch]);

  // UPDATE PAGE TITLE
  useEffect(() => {
    if (NotifyData.length > 0) {
      document.title = `${webDetails?.site_name} (${NotifyData.length}) unread messages`;
    } else {
      document.title = webDetails?.site_name;
    }
  }, [NotifyData, webDetails]);

  useEffect(() => {
    if (isAuthenticated && !pathname.includes("chat")) {
      if (user.userData.role === "Client" || user.userData.role === "Lawyer") {
        dispatch(fetchUnreadMessage());
      }
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/online-users" element={<OnlineUsers />} />

      {/* // ? Default Layout routes */}
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email/:code" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/practice-areas" element={<PracticeAreas />} />
        <Route path="/practice-areas/:slug/:id" element={<PracticeArea />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/lawyer-profile" element={<LawyerProfile />} />
        <Route path="/lawyer/:id" element={<LawyerProfile />} />
      </Route>

      <Route path="/card/:id" element={<PaymentPage />} />
      <Route path="/payment-success/:result" element={<PaymentSuccess />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route
        path="/legal-professionals"
        element={
          <AsideProvider>
            <FindLawyer />
          </AsideProvider>
        }
      />

      {/* // ? Auth routes */}
      <Route path="/auth" element={<Auth />}>
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/auth/verify-email" element={<VerifyAccount />} />
        <Route
          path="/auth/request-verification"
          element={<RequestVerificationToken />}
        />
        <Route
          path="/auth/forgot-password"
          element={<RequestVerificationToken />}
        />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="/meeting/:id" element={<MeetingStartup />} />

      <Route
        path={"/customchat"}
        element={<CommonRoute Component={CustomChat} />}
      />

      {/* // ? Admin's protected routes */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route
          path="/admin/dashboard"
          element={<AdminRoute Component={Dashboard} />}
        />

        <Route
          path="/admin/account-settings"
          element={<AdminRoute Component={ManageProfile} />}
        />
        <Route
          path="/admin/practice-areas"
          element={<AdminRoute Component={Expertise} />}
        />
        <Route
          path="/admin/jurisdictions"
          element={<AdminRoute Component={Jurisdiction} />}
        />
        <Route
          path="/admin/countries"
          element={<AdminRoute Component={Countries} />}
        />
        <Route
          path="/admin/users"
          element={<AdminRoute Component={ManageUsers} />}
        />
        <Route
          path="/admin/moderators"
          element={<AdminRoute Component={ManageModerators} />}
        />
        <Route
          path="/admin/lawyers"
          element={<AdminRoute Component={ManageLawyers} />}
        />
        <Route
          path="/admin/clients"
          element={<AdminRoute Component={ManageClients} />}
        />
        <Route
          path="/admin/settings/site"
          element={<AdminRoute Component={WebSetting} />}
        />
        <Route
          path="/admin/withdraw-requests"
          element={<AdminRoute Component={WithdrawRequests} />}
        />
        <Route
          path="/admin/faqs"
          element={<AdminRoute Component={AdminFAQs} />}
        />
        <Route
          path="/admin/messages"
          element={<AdminRoute Component={ContactUsForAdmin} />}
        />
        <Route
          path="/admin/message/:id"
          element={<AdminRoute Component={MessageViewForAdmin} />}
        />
        <Route
          path="/admin/user/statistics/:id"
          element={<AdminRoute Component={UserStatistics} />}
        />
        <Route
          path="/admin/newsletter"
          element={<AdminRoute Component={NewsLetter} />}
        />
        <Route
          path="/admin/settings/carousel"
          element={<AdminRoute Component={CarouselPage} />}
        />
        <Route
          path={"/admin/contracts"}
          element={<CommonRoute Component={ContractList} />}
        />
      </Route>

      {/* // ? Lawyer's protected routes */}
      <Route path="/lawyer" element={<DashboardLayout />}>
        <Route
          path="/lawyer/dashboard/:id?"
          element={<LawyerRoute Component={LawyerDashboard} />}
        />
        <Route
          path="/lawyer/transactions"
          element={<LawyerRoute Component={Transactions} />}
        />
        <Route
          path="/lawyer/wallet"
          element={<LawyerRoute Component={Wallet} />}
        />
        <Route
          path="/lawyer/account-settings"
          element={<CommonRoute Component={AccountSetting} />}
        />
        <Route
          path="/lawyer/appointments"
          element={<LawyerRoute Component={AppointmentList} />}
        />
        <Route
          path="/lawyer/milestone/stage/:id"
          element={<LawyerRoute Component={CreateMilestone} />}
        />
        <Route
          path="/lawyer/milestone/step"
          element={<LawyerRoute Component={CreateMilestone} />}
        />
        <Route
          path="/lawyer/milestones"
          element={<LawyerRoute Component={ViewMilestone} />}
        />
        <Route
          path="/lawyer/milestone/:id"
          element={<LawyerRoute Component={ViewMilestone} />}
        />
        <Route
          path="/lawyer/milestone/stage/:id"
          element={<LawyerRoute Component={ViewMilestoneSteps} />}
        />
        <Route
          path={"/lawyer/contracts"}
          element={<CommonRoute Component={ContractList} />}
        />

        <Route
          path="/lawyer/contract/create"
          element={<LawyerRoute Component={ContractCreation} />}
        />
        <Route
          path="/lawyer/notifications"
          element={<LawyerRoute Component={Notification} />}
        />
      </Route>

      {/* // ? Client's protected routes */}
      <Route
        path="/client-profile"
        element={<ClientRoute Component={ClientProfile} />}
      />
      <Route path="/client" element={<DashboardLayout />}>
        <Route
          path="/client/dashboard/:id?"
          element={<ClientRoute Component={ClientDashboard} />}
        />
        <Route
          path="/client/account-settings"
          element={<CommonRoute Component={AccountSetting} />}
        />
        <Route
          path="/client/dashboard/:id"
          element={<ClientRoute Component={ClientDashboard} />}
        />
        <Route
          path="/client/payment/:id"
          element={<ClientRoute Component={PaymentPage} />}
        />
        <Route
          path="/client/appointments/:id?"
          element={<ClientRoute Component={AppointmentList} />}
        />
        <Route
          path="/client/view-milestone"
          element={<ClientRoute Component={ViewMilestone} />}
        />
        <Route
          path="/client/view-milestone/:id"
          element={<ClientRoute Component={ViewMilestone} />}
        />
        <Route
          path="/client/view-milestone-stage/:id"
          element={<ClientRoute Component={ViewMilestoneSteps} />}
        />
        <Route
          path={"/client/contracts"}
          element={<CommonRoute Component={ContractList} />}
        />
        <Route
          path="/client/notifications"
          element={<ClientRoute Component={Notification} />}
        />
      </Route>

      {/* // ? common protected routes */}
      <Route path="/chat" element={<CommonRoute Component={ChatLayout} />} />
      <Route
        path="/chat/:id"
        element={<CommonRoute Component={ChatLayout} />}
      />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route
          path="/dashboard/video-meeting/:id"
          element={<CommonRoute Component={VideoMeeting} />}
        />
        <Route
          path="/dashboard/video-meeting/:id"
          element={<CommonRoute Component={VideoMeeting} />}
        />
        <Route
          path="/dashboard/book-appointment"
          element={<CommonRoute Component={BookAppointment} />}
        />
        <Route
          path="/dashboard/contract-details/:id"
          element={<CommonRoute Component={ContractDetails} />}
        />
        <Route
          path="/dashboard/message/:id"
          element={<AdminRoute Component={MessageViewForAdmin} />}
        />
        <Route
          path="/dashboard/contract-details-payment/:id"
          element={<CommonRoute Component={ContractDetails} />}
        />
      </Route>

      {/* // ? Not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
