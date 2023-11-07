import { Image } from "antd";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ImageIcon, SendIcon } from "../../../../assets/icons/Icons";
import { chatActions } from "../../../../store/store";
import Button from "../../../UI/Button/Button";

const { sendChat } = chatActions;

const NewChat = ({ sendChatLoading, selectedChatTicket }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const openFileInput = () => {
    fileInputRef.current.click();
  };
  const removeFileHandler = () => {
    setFile(null);
    setImgUrl(null);
    fileInputRef.current.files = null;
  };
  const onFileChange = (e) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => setImgUrl(reader.result));
    reader.readAsDataURL(fileInputRef.current.files[0]);
    setFile(fileInputRef.current.files[0]);
  };

  const sendChatHandler = () => {
    let body;
    if (file) {
      body = new FormData();
      body.append("transactionNumber", selectedChatTicket.transactionNumber);
      body.append("msgType", "img");
      body.append("file", file);
    } else {
      body = {
        msgType: "msg",
        content: content,
        transactionNumber: selectedChatTicket.transactionNumber,
      };
    }
    dispatch(sendChat(body));
    removeFileHandler();
    setContent("");
  };
  return (
    <div className="flex flex-row py-2 items-center justify-between">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />
      <Button
        onClick={openFileInput}
        type={"icon"}
        className="text-gray-700"
        Icon={ImageIcon}
      />
      {/* <div className="flex-1 bg-gray-300 rounded-2xl p-2 text-sm"> */}
      {file && (
        <div className="flex-1 flex flex-row items-center rounded-2xl p-2 text-sm text-gray-700">
          <Image crossOrigin="same-site" src={imgUrl} />
          <Button onClick={removeFileHandler} text="Remove" type={"danger"} />
        </div>
      )}
      {!file && (
        <textarea
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey == false) {
              e.preventDefault();
              sendChatHandler();
            }
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          cols={1}
          wrap="soft"
          placeholder="Aa"
          className="flex-1 resize-none bg-gray-200 rounded-2xl p-2 text-sm text-gray-700 focus:ring-0 focus:ring-offset-0 outline-0"
        />
      )}
      {/* </div> */}
      <Button
        disabled={!file && !content.trim().length > 0}
        loading={sendChatLoading}
        type={"icon"}
        className="text-gray-700"
        Icon={SendIcon}
        onClick={sendChatHandler}
      />
    </div>
  );
};

export default NewChat;
