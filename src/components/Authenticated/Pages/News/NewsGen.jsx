import { Form, Modal, Radio, message } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AddHeadline from "./Modal/AddHeadline";
import AddImg from "./Modal/AddImg";
import AddText from "./Modal/AddText";
import AddVid from "./Modal/AddVid";
import { PreviewContent } from "./Modal/PreviewContent";
import { addNewsType } from "../../../../Constants/static";
import {
  creatingNews,
  getNewsFetch,
} from "../../../../store/slices/news-slice";

const NewsGen = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.news);

  const [selectedOption, setSelectedOption] = useState("text");
  const [imagePreview2, setImagePreview2] = useState(null);

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenAddNews, setIsOpenAddNews] = useState(false);
  const [preview, setPreview] = useState([]);
  const [mainData, setMainData] = useState({});

  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);

  const [isEdit, setIsEdit] = useState(false);

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const handleDeleteClick = (index) => {
    const newPreview = [...preview];
    newPreview.splice(index, 1);
    setPreview(newPreview);
  };
  const handleEditClick = (p) => {
    setIsOpenAdd(true);
    form2.setFieldsValue({ ...p });
    setSelectedOption("text");
    setIsEdit(true);
  };

  const handleAddContent = () => {
    setIsOpenAdd(!isOpenAdd);
    setSelectedOption(selectedOption);
  };

  const handleOk = () => {
    setIsOpenAdd(false);
  };
  const handleCancel = () => {
    setIsOpenAdd(false);
  };

  const handleAdd = async () => {
    const modifiedPreview = preview.map((c, i) => {
      if (c.type === "text") {
        const { id, ...modifiedObj } = c;
        const newObj = { ...modifiedObj, value: `${i};;;${c.value}` };
        return newObj;
      } else if (c.type === "image" || c.type === "video") {
        const { id, ...modifiedObj } = c;
        const fileObj = c.value.fileList[0].originFileObj;
        const myNewFile = new File([fileObj], `${i};;;${fileObj.name}`, {
          type: fileObj.type,
        });

        const newObj = {
          ...modifiedObj,
          value: myNewFile,
        };
        return newObj;
      } else {
        const { id, ...modifiedObj } = c;
        return modifiedObj;
      }
    });
    const formData = new FormData();
    modifiedPreview
      .filter((p) => p.type === "image")
      .forEach((p) => formData.append("image", p.value));
    modifiedPreview
      .filter((p) => p.type === "video")
      .forEach((p) => formData.append("video", p.value));
    const texts = JSON.stringify(
      modifiedPreview.filter((p) => p.type === "text").map((p) => p.value)
    );
    formData.append("text", texts);
    formData.append("cover", mainData.coverURL);
    formData.append("headline", mainData.headline);
    formData.append("subtitle", mainData.subtitle);
    formData.append("sourceLink", mainData.sourceLink);

    const data = { ...mainData, contents: [...modifiedPreview] };

    if (
      Object.keys(data.coverURL).length > 0 &&
      data.headline &&
      data.subtitle
    ) {
      dispatch(
        creatingNews({
          body: formData,
          cb: () => {
            dispatch(getNewsFetch());
            form1.resetFields();
          },
        })
      );
      setIsOpenAddNews(false);
      setImagePreview(null);
      setMainData({});
      setPreview([]);
      // message.error("Please fill in all required fields.");
      return;
    }
  };
  const handleCloseAddNews = () => {
    setIsOpenAddNews(false);
  };

  return (
    <div className=" pb-10 px-4 relative">
      <div className=" flex justify-start pt-5">
        <Link
          className=" py-2 px-4 bg-headerblue text-white rounded-lg"
          to="/news"
        >
          Go back
        </Link>
      </div>

      {Object.keys(mainData).length !== 0 && (
        <>
          <div className=" flex flex-col justify-center items-center">
            <h1 className=" text-4xl font-semibold">News Preview</h1>
            <div className=" w-full h-2 bg-blue-gray-200"></div>
          </div>
          <div className=" md:px-0 px-6">
            <div className="mt-5 flex flex-col items-center justify-center bg-[#eeeeee] py-10">
              <div className=" flex justify-center items-center max-w-[1000px]">
                {imagePreview && (
                  <img
                    className=" w-full h-full rounded-md"
                    src={imagePreview}
                    alt="/"
                  />
                )}
              </div>
              <div className=" px-5">
                <h1 className=" text-[#1e293b] font-bold text-center mt-10 sm:text-[32px] text-[24px]">
                  {mainData?.headline}
                </h1>
                <p className=" text-defblue text-center sm:text-[16px] text-[14px]">
                  {mainData?.subtitle &&
                    moment(mainData?.subtitle).format("LL")}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {preview.length !== 0 && (
        // <ConfigProvider theme={{ token: { colorPrimary: '#1C4E84' } }}>
        <div className=" bg-[#F8F9F9] sm:py-32 py-10">
          <div className=" container mx-auto grid grid-cols-4 sm:gap-10 gap-5 bg-white shadow-xl sm:px-20 px-2 lg:py-40 md:py-28 py-10 rounded-lg">
            {/* {Promise.all( */}
            {preview.map((p, i) => {
              return (
                <PreviewContent
                  preview={p}
                  key={i}
                  index={i}
                  handleDeleteClick={handleDeleteClick}
                  handleEditClick={handleEditClick}
                  setIsEdit={setIsEdit}
                />
              );
            })}
            {/* <img src={imagePreview2} alt="/" /> */}
          </div>
          <div className=" flex flex-col justify-center items-center pt-10">
            {/* <h1 className=" text-4xl font-semibold">Content Preview</h1> */}
            <div className=" w-full h-2 bg-blue-gray-200"></div>
          </div>
        </div>
        // </ConfigProvider>
      )}

      <AddHeadline
        handleAddContent={handleAddContent}
        setImagePreview={setImagePreview}
        setMainData={setMainData}
        // setIsOpenHead={setIsOpenHead}
        // isOpenHead={isOpenHead}
        mainData={mainData}
        setFile={setFile}
        file={file}
        form1={form1}
        setIsOpenAddNews={setIsOpenAddNews}

        // isLoading={isLoading}
      />
      {/* )} */}

      <Modal
        title={<h1 className=" text-2xl font-semibold">Add Content</h1>}
        open={isOpenAdd}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
      >
        <div className=" ">
          {/* <h1 className=" text-center text-4xl font-semibold py-5"> Add Content </h1> */}
          <Radio.Group
            className=" flex justify-center items-center"
            defaultValue={selectedOption}
            value={selectedOption}
            style={{
              width: "100%",
            }}
            onChange={(e) => setSelectedOption(e.target.value)}
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
            {selectedOption === "text" && isOpenAdd && (
              <AddText
                setIsOpenAdd={setIsOpenAdd}
                preview={preview}
                setPreview={setPreview}
                form2={form2}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
              />
            )}
            {selectedOption === "image" && isOpenAdd && (
              <AddImg
                preview={preview}
                setPreview={setPreview}
                // form2={form2}
                setIsOpenAdd={setIsOpenAdd}
                setImagePreview2={setImagePreview2}
                imagePreview2={imagePreview2}
              />
            )}
            {selectedOption === "video" && isOpenAdd && (
              <AddVid preview={preview} setPreview={setPreview} />
            )}
          </div>
        </div>
      </Modal>

      <div className=" flex justify-center items-center">
        <Modal
          title={<h1 className=" text-2xl font-semibold">Add News</h1>}
          open={isOpenAddNews}
          onOk={handleAdd}
          okText="Yes"
          cancelText="No"
          // centered
          onCancel={handleCloseAddNews}
          okButtonProps={{ disabled: isLoading, type: "default" }}

          // okButtonProps={{ style: { display: 'none' } }}
        >
          Do you want to procceed?
        </Modal>
      </div>
    </div>
  );
};

export default NewsGen;
