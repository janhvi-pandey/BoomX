import React from "react";
const Toast = ({ message, type = "success", visible }) => {
  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-8 right-5  px-4 py-2 rounded shadow text-sm z-50 transition-opacity duration-300 ${
        type === "error" ? "bg-red-600" : "bg-[#3a003a]"
      } text-white`}
    >
      {message}
    </div>
  );
};

export default Toast;
