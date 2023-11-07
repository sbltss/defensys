import React, { useState } from "react";
import EditItem from "./EditItem";

const InfoItem = ({ field, value, editable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex flex-row justify-between px-2">
      <div className={isEditing ? "flex flex-row" : "flex flex-row flex-wrap"}>
        <span className="w-[280px] text-gray-700">{field}</span>
        {!isEditing && <span>{value}</span>}
        {isEditing && <EditItem type={field} setIsEditing={setIsEditing} />}
      </div>

      {!isEditing && editable && (
        <div
          className="rounded-lg hover:bg-blue-50 py-1 px-4 duration-300 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <span className="text-primary font-medium">Edit</span>
        </div>
      )}
    </div>
  );
};

export default InfoItem;
