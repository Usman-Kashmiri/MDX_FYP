import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import AsideProvider from "../contexts/AsideContext";

const DefaultLayout = () => {
  return (
    <>
      {/* Header */}
      <AsideProvider>
        <Header />
      </AsideProvider>

      {/* Outlet */}
      <div>
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default DefaultLayout;
