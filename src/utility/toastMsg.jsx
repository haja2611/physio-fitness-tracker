import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "toastify-js/src/toastify.css";
const CONFIG_OPTIONS = {
  position: "bottom-center",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showInfoToast = (toastMessage) => {
  toast.info(toastMessage, CONFIG_OPTIONS);
};

export const showSuccessToast = (toastMessage) => {
  toast.success(toastMessage, CONFIG_OPTIONS);
};

export const showWarnToast = (toastMessage) => {
  toast.warn(toastMessage, CONFIG_OPTIONS);
};

export const showErrorToast = (toastMessage) => {
  toast.error(toastMessage, CONFIG_OPTIONS);
};

export const ToastMessage = () => {
  return <ToastContainer />;
};
