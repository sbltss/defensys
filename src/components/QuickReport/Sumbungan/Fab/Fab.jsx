import React from "react";
import { PhoneIcon } from "../../../../../../Assets/Resources/Icons/Icons";

const Fab = ({ onClick, disabled }) => {
  let className = "";
  if (disabled) className = "opacity-30 cursor-not-allowed ";
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={
        className +
        "rounded-full bg-primary text-white h-16 w-16 flex flex-col justify-center items-center absolute bottom-6 right-6"
      }
    >
      <span className="font-bold text-xl text-white flex flex-col items-center">
        <PhoneIcon />
      </span>
    </div>
  );
};

export default Fab;
