import axios from "axios";

import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseURL = '/api/'

const apiFetcher = {
  get: async (url) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios.get(`${baseURL}${url}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response?.data?.error) handleApiError(response?.data?.message);
      return response?.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  post: async (url, data = {}) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios.post(`${baseURL}${url}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.error) {
        handleApiError(response?.data?.message);
        response.data.navigate = false;
      } else {
        toast.success(response?.data?.message);
      }
      return response?.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  put: async (url, data = {}) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios.put(`${baseURL}${url}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.error) {
        handleApiError(response?.data?.message);
        response.data.navigate = false;
      } else {
        toast.success(response?.data?.message);
      }

      return response?.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  delete: async (url) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios.delete(`${baseURL}${url}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.error) {
        handleApiError(response?.data?.message);
        response.data.navigate = false;
      } else {
        toast.success(response?.data?.message);
      }

      return response?.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

const handleApiError = (error) => {
  toast.error(error);
  // Handle and log the API error here
  console.error("API Error:", error);
  return;
};

export default apiFetcher;
