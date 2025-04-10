import toast from "react-hot-toast";

export const showToast = (type, message) => {
  switch (type) {
    case "success":
      toast.success(message, { duration: 4000 });
      break;
    case "error":
      toast.error(message, { duration: 6000 });
      break;
    case "loading":
      return toast.loading(message); // Returns an ID to dismiss later
    default:
      toast(message);
  }
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};