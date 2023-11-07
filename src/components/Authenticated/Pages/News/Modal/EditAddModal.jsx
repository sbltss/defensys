import { Modal, Radio } from "antd";
import React, { useState } from "react";
import { addNewsType } from "../../../../constants/static";
import EditAddForm from "./EditAddForm";

const EditAddModal = ({
  isOpenAddContent,
  setIsOpenAddContent,
  setNewsId,
  selectedType,
  setSelectedType,
  setContentLength,
  contentLength,
  formEditAdd,
  formEditAddImg,
  formEditAddText,
  formEditAddVid,
  newsId,
  isAdd,
  contId,
  setImageUrl,
  imageUrl,
  setVideoUrl,
  videoUrl,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const handleCancel = () => {
    setIsOpenAddContent(false);
    setNewsId({});
    setImagePreview(null);
    setVideoPreview(null);
    setImageUrl(null);
    setVideoUrl(null);
    formEditAddImg.resetFields();
    formEditAddVid.resetFields();
    formEditAddText.resetFields();
  };
  return (
    <>
      <Modal
        title={<h1 className=" text-2xl font-semibold">{isAdd ? "Add" : "Edit"} Content</h1>}
        open={isOpenAddContent}
        // onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
      >
        <div className=" ">
          <Radio.Group
            className=" flex justify-center items-center"
            defaultValue={selectedType}
            value={selectedType}
            style={{
              width: "100%",
            }}
            onChange={(e) => setSelectedType(e.target.value)}
            // ref={fontSize}
            // onChange={onSizeChange}
          >
            {/* <Row className=" w-full flex justify-center"> */}
            {addNewsType.map((obj, i) => {
              return (
                // <Col key={i} span={8}>
                <Radio key={i} value={obj.value}>
                  {/* <p className=" xs:text-[16px] text-[15px] my-2">{obj.label}</p> */}
                  <img className=" w-7 h-7" src={obj.icon} alt="/" />
                </Radio>
                // </Col>
              );
            })}
            {/* </Row> */}
          </Radio.Group>
          <div className=" max-w-[700px] mx-auto">
            <EditAddForm
              setIsOpenAddContent={setIsOpenAddContent}
              setContentLength={setContentLength}
              contentLength={contentLength}
              selectedType={selectedType}
              formEditAdd={formEditAdd}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              videoPreview={videoPreview}
              setVideoPreview={setVideoPreview}
              formEditAddText={formEditAddText}
              formEditAddImg={formEditAddImg}
              formEditAddVid={formEditAddVid}
              newsId={newsId}
              isAdd={isAdd}
              contId={contId}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditAddModal;
