import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import FindLawyer from "../pages/FindLawyer";
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
import AppointmentList from "../pages/lawyer/AppointmentList";
import Countries from "../pages/admin/Countries";
import WebSetting from "../pages/admin/WebSetting";
import AdminFAQs from "../pages/admin/FAQs";
import Notification from "../pages/admin/Notification";
import UserStatistics from "../pages/admin/UserStatistics";
import CarouselPage from "../pages/admin/CarouselPage";
import PracticeAreas from "../pages/PracticeAreas";
import PracticeArea from "../pages/PracticeArea";
import AsideProvider from "../contexts/AsideContext";

const Router = () => {
  return (
    <Routes>
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
          path="/admin/faqs"
          element={<AdminRoute Component={AdminFAQs} />}
        />
        <Route
          path="/admin/user/statistics/:id"
          element={<AdminRoute Component={UserStatistics} />}
        />
        <Route
          path="/admin/settings/carousel"
          element={<AdminRoute Component={CarouselPage} />}
        />
      </Route>

      {/* // ? Lawyer's protected routes */}
      <Route path="/lawyer" element={<DashboardLayout />}>
        <Route
          path="/lawyer/dashboard/:id?"
          element={<LawyerRoute Component={LawyerDashboard} />}
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
          path="/client/appointments/:id?"
          element={<ClientRoute Component={AppointmentList} />}
        />
        <Route
          path="/client/notifications"
          element={<ClientRoute Component={Notification} />}
        />
      </Route>

      {/* // ? common protected routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route
          path="/dashboard/book-appointment"
          element={<CommonRoute Component={BookAppointment} />}
        />
      </Route>

      {/* // ? Not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
