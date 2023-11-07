import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
const buttonActiveClass =
  "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100 inline-flex rounded-md px-4 py-2 text-sm font-medium duration-300";
const buttonInactiveClass =
  "border-gray-900 bg-gray-700 hover:bg-gray-800 text-gray-100 inline-flex rounded-md px-4 py-2 text-sm font-medium duration-300";

const UseMapControl = (text) => {
  const [visible, setVisible] = useState(true);
  const button = useRef(null);

  const createButton = (text, cb) => {
    const btn = document.createElement("button");
    btn.className = buttonActiveClass;
    btn.innerText = text;
    btn.addEventListener("click", cb);
    return btn;
  };
  const toggleVisible = () => {
    button.current.removeEventListener("click", toggleVisible);
    setVisible(!visible);
  };
  useEffect(() => {
    if (button.current) {
      button.current.addEventListener("click", toggleVisible);
      if (visible) button.current.className = buttonActiveClass;
      else button.current.className = buttonInactiveClass;
    }
  }, [visible, button.current]);

  useEffect(() => {
    button.current = createButton(text, toggleVisible);
  }, []);
  return [visible, button];
};

export default UseMapControl;
