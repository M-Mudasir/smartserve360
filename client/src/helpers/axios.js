import axios from "./axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      await window.cookieStore.delete("accessToken");
      window.location.reload();
    }
    let message = "Can't connect to server! ";
    if (process.browser && navigator.onLine) {
      message += "Please reload the page and try again.";
    } else {
      message +=
        "You are currently offline. Please check your internet connection and try again.";
    }

    if (error) {
      // eslint-disable-next-line no-undef
      return Promise.reject(error);
    }

    // eslint-disable-next-line no-undef
    return Promise.reject(message);
  }
);

export default instance;
