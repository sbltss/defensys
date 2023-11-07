import React from "react";
import { LoadingIcon } from "../../../assets/icons/Icons";

const Button = React.forwardRef(
  (
    {
      onClick,
      type,
      text,
      disabled = false,
      Icon = null,
      loading = false,
      htmlType = "submit",
    },
    ref
  ) => {
    let className = "";
    if (!disabled) {
      if (type === "primary")
        className =
          "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100 ";
      if (type === "warning")
        className =
          "border-warning-600 bg-warning-500 hover:bg-warning-600 text-gray-800 ";
      if (type === "danger")
        className =
          "border-danger-800 bg-danger-700 hover:bg-danger-800 text-gray-100 ";
      if (type === "success")
        className =
          "border-success-700 bg-success-600 hover:bg-success-700 text-gray-100 ";
      if (type === "muted")
        className =
          "border-gray-400 bg-gray-300 hover:bg-gray-400 text-gray-800 ";
      if (type === "icon") className = " hover:bg-gray-200";
      if (type !== "menu") className += "shadow-sm justify-center ";
    } else {
      if (type === "warning")
        className =
          "border-warning-600 bg-warning-500 text-gray-800 opacity-50 justify-center ";
      else className = " text-gray-800 opacity-50 justify-center ";
    }
    if (loading) className = className + `opacity-50 `;
    return (
      <button
        type={htmlType}
        ref={ref}
        disabled={disabled || loading}
        onClick={onClick}
        className={
          className +
          " mx-1 inline-flex rounded-md px-4 py-2 text-sm font-medium duration-300 items-center"
        }
      >
        <nobr className="flex flex-row items-center gap-2">
          {loading && <LoadingIcon />}
          {!loading && (
            <>
              {Icon && <Icon />}
              {text}
            </>
          )}
        </nobr>
      </button>
    );
  }
);

export default Button;
