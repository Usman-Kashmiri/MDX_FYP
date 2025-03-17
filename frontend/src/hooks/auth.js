import { useSelector } from "react-redux";

export const useAuth = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Fetchnig token expire time
  const localStorageAfterTime = localStorage.getItem("afterTokenExpires");
  const localStorageBeforeTime = localStorage.getItem("beforeTokenExpires");

  // parsing in datetime
  const beforeTokenExpires = new Date(localStorageBeforeTime);
  const afterTokenExpires = new Date(localStorageAfterTime);

  if (isAuthenticated && localStorageAfterTime && localStorageBeforeTime) {
    if (new Date() <= afterTokenExpires) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  } else {
    return false;
  }
};

export const getUserData = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    return userData;
  } else {
    return false;
  }
};

export const UseGetRole = () => {
  const { user } = useSelector((state) => state.auth);
  if (user) {
    return user?.userData?.role;
  } else {
    return false;
  }
};

export const UseGetProvider = () => {
  const { user } = useSelector((state) => state.auth);
  if (user) {
    return user?.userData?.provider;
  } else {
    return false;
  }
};
