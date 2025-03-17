import axios from "axios";
import { errorMessage } from "../globalFunctions";

// export const baseURL = "http://127.0.0.1:8000/api"; // local
// export const baseURL = "https://lawyer-be.xiomstudio.com/api"; // hostinger
// export const baseURL = "https://drhalo.ca/api"; // client's hosting (DreamHost)
export const baseURL = "https://lawyer.dotclick.co/api"; // dotclick hosting (Dotclick.co/cpanel)

const custAxios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// attaching Bearer token to axios so that it can be used in all the requests and the server can verify the user
export const attachToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    custAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Refresh Token logic

let isRefreshing = false;
custAxios.interceptors.request.use(async (config) => {
  const currentTime = new Date();

  const beforeTokenExpires = new Date(
    localStorage.getItem("beforeTokenExpires")
  );
  const afterTokenExpires = new Date(localStorage.getItem("afterTokenExpires"));

  if (currentTime >= beforeTokenExpires && currentTime <= afterTokenExpires) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        // Refresh token logic here
        attachToken();
        const res = await custAxios.get("/auth/refresh");
        if (res.data.res === "success") {
          const currentTime = new Date();

          localStorage.setItem(
            "beforeTokenExpires",
            new Date(currentTime.getTime() + 30 * (60 * 23) * 1000)
          );
          localStorage.setItem(
            "afterTokenExpires",
            new Date(currentTime.getTime() + 61 * (60 * 23) * 1000)
          );

          localStorage.setItem("token", res?.data?.token?.access_token);

          // Attach the new token to the request headers
          config.headers.Authorization = `Bearer ${res?.data?.token?.access_token}`;
        }
      } catch (error) {
        console.log("Refresh token failed! ", error);
      }

      isRefreshing = false;
    }
  } else if (
    localStorage.getItem("beforeTokenExpires") &&
    currentTime > afterTokenExpires
  ) {
    errorMessage("Your session has been expired. Please login again.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("beforeTokenExpires");
    localStorage.removeItem("afterTokenExpires");

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  return config;
});

// attaching Bearer token to form axios so that it can be used in all the requests and the server can verify the user
export const attachTokenWithFormAxios = () => {
  const token = localStorage.getItem("token");

  if (token) {
    formAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const formAxios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

export default custAxios;
