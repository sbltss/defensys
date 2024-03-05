import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

const types = {
  primary:
    "border-primary-700 bg-primary-700 text-gray-100 hover:bg-primary-800",
  danger: "border-danger-700 bg-danger-700 text-gray-100 hover:bg-danger-800",
  // success: "bg-green-800 text-gray-100",
  warning:
    "border-warning-500 bg-warning-500 hover:bg-warning-600 text-gray-800",
  // neutral: "bg-gray-100 text-gray-800",
};

const placements = {
  bottomLeft: { placement: "left-0", arrowOrientation: "" },
  bottomRight: { placement: "right-0", arrowOrientation: "" },
  topLeft: { placement: "left-0 bottom-10", arrowOrientation: "rotate-180" },
  topRight: { placement: "right-0 bottom-10", arrowOrientation: "rotate-180" },
  right: {
    placement: "left-[105%] -top-[25%]",
    arrowOrientation: "-rotate-90",
  },
};

const MenuButton = ({ type, children, text, anchor = "right" }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={
            types[type] +
            " inline-flex w-full justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-s"
          }
        >
          <nobr>{text}</nobr>
          <svg
            className={
              placements[anchor].arrowOrientation +
              " -mr-1 ml-2 h-5 w-5 duration-200"
            }
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={
            placements[anchor === "topRight" ? anchor : "right"].placement +
            "  mt-2 z-10 min-w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          }
        >
          <div className="z-[999999]">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MenuButton;
