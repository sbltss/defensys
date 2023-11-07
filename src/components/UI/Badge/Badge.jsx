import React from "react";

const types = {
  primary: "bg-primary-800 text-gray-100",
  danger: "bg-danger-800 text-gray-100",
  success: "bg-green-800 text-gray-100",
  warning: "bg-warning-500 text-gray-800",
  neutral: "bg-gray-100 text-gray-800",
};

const ticketStatus = {
  ticketStatus: {
    "-1": { text: "Reported", className: types["danger"] },
    0: { text: "Pending", className: types["warning"] },
    1: { text: "Accepted", className: types["primary"] },
    2: { text: "Resolved", className: types["success"] },
    3: { text: "Reported", className: types["success"] },
  },
  allocateStatus: {
    0: { text: "Pending", className: types["warning"] },
    1: { text: "Ongoing", className: types["primary"] },
    2: { text: "Declined", className: types["danger"] },
    3: { text: "Reported", className: types["success"] },
  },
};

const Badge = ({ type, text }) => {
  let className = "";
  if (type === "caseType") className = types["neutral"];

  if (type === "withInjury" || type === "deactivated")
    className = types["danger"];
  if (type === "withoutInjury" || type === "active")
    className = types["success"];

  if (type === "status") {
    className = types["danger"];
  }

  if (["ticketStatus", "allocateStatus"].includes(type)) {
    return (
      <span
        className={
          ticketStatus[type][text].className +
          " text-sm font-medium px-2.5 py-0.5 rounded"
        }
      >
        <nobr className="text-center">{ticketStatus[type][text].text}</nobr>
      </span>
    );
  }
  if (!text && type === "caseType")
    return (
      <span
        className={className + " text-sm font-medium px-2.5 py-0.5 rounded"}
      >
        <nobr className="text-center">Pending Info</nobr>
      </span>
    );

  return (
    <span className={className + " text-sm font-medium px-2.5 py-0.5 rounded"}>
      {type === "caseType" && text}
      {type !== "caseType" && (
        <nobr className="text-center">
          {text
            ? text
            : type === "withInjury"
            ? "With Injury"
            : "Without Injury"}
        </nobr>
      )}
    </span>
  );
};

export default Badge;
