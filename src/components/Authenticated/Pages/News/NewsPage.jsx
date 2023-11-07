import { DownOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Dropdown, Form, Image, Modal, Popconfirm, Table } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EditNewsForm from "./Modal/EditNewsForm";
import EditAddModal from "./Modal/Edit-Add-News/EditAddModal";
import { getNewsFetch, removingContent, removingNews } from "../../../../store/slices/news-slice";
import NewsGenerated from "./NewsGenerated";

// import { getNewsFetch, removingContent, removingNews } from "../../../store/slices/news/newsSlice";

const NewsPage = () => {
  const [formEdit] = Form.useForm();
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [idParams, setIdParams] = useState(null);
  // const [formEditText] = Form.useForm();
  // const [formEditImg] = Form.useForm();
  // const [formEditVid] = Form.useForm();
  const [formEditAddText] = Form.useForm();
  const [formEditAddImg] = Form.useForm();
  const [formEditAddVid] = Form.useForm();
  const [imageEditPreview, setImageEditPreview] = useState(null);
  const [fileEdit, setFileEdit] = useState(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  // const [isOpenEditText, setIsOpenEditText] = useState(false);
  // const [isOpenEditImg, setIsOpenEditImg] = useState(false);
  // const [isOpenEditVid, setIsOpenEditVid] = useState(false);
  const [isOpenAddContent, setIsOpenAddContent] = useState(false);
  const [mainEdit, setMainEdit] = useState({});
  const [newsId, setNewsId] = useState({});
  const [contId, setContId] = useState({});
  const [contentLength, setContentLength] = useState(0);
  const [selectedType, setSelectedType] = useState("text");
  // const [addContentData, setAddContentData] = useState({});
  const [isAdd, setIsAdd] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [prevCover, setPrevCover] = useState(null);

  const news = useSelector((state) => state.news.newsList);
  const { isLoading } = useSelector((state) => state.news);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNewsFetch());
  }, [dispatch]);

  const handleCancelPreview = () => {
    setIdParams(null);
    setIsOpenPreview(false);
  };

  const sortedNews = [...news]?.sort((a, b) => new Date(b.subtitle) - new Date(a.subtitle));
  const newsTable = sortedNews?.map((news, i) => {
    const handleEdit = () => {
      setNewsId(news.newsId);
      setCoverUrl(news.coverUrl);
      setPrevCover(news.coverUrl);

      const res = {
        ...news,
        subtitle: dayjs(news.subtitle),
        // subtitle: '',
        coverUrl: null,
        // coverUrl: file,
      };

      setIsOpenEdit(true);

      formEdit.resetFields(["coverUrl"]);
      formEdit.setFieldsValue({ ...res });

      setMainEdit((prevState) => ({
        ...prevState,
        headline: res.headline,
        subtitle: res.subtitle,
        coverUrl: res.coverUrl,
      }));
    };

    const handleAddContent = () => {
      setContentLength(news.contents.length);
      setNewsId(news.newsId);
      setIsOpenAddContent(true);
      setSelectedType(selectedType);
      setIsAdd(true);
    };

    const cover = (
      <Image
        // className=" w-full h-[150px] rounded-md object-cover"
        width={250}
        height={150}
        src={`${import.meta.env.VITE_BASE_URL}/${news?.coverUrl}`}
        alt="/"
      />
    );
    const date = moment(news?.subtitle).format("LL");
    const description = news.contents.map((cont, i) => {
      const handleEditCont = () => {
        setContentLength(news.contents.length);
        const res = {
          ...cont,
          type: null,
        };
        if (cont.type === "text") {
          setImageUrl(null);
          setVideoUrl(null);
        } else if (cont.type === "image" || cont.type === "video") {
          if (cont.type === "image") {
            setImageUrl(cont.value);
            setVideoUrl(null);
          } else if (cont.type === "video") {
            setVideoUrl(cont.value);
            setImageUrl(null);
          }
          res.value = null;
        } else {
          res.value = cont.value;
        }
        // console.log('RESRES', res);
        formEditAddText.setFieldsValue(res);
        formEditAddImg.setFieldsValue(res);
        formEditAddVid.setFieldsValue(res);
        setContId(cont.contentId);
        setIsOpenAddContent(true);
        setSelectedType(cont.type);
        setIsAdd(false);
      };
      const items = [
        {
          label: (
            <div
              className=" flex justify-center items-center"
              // onClick={() => setIsOpenEditCont(true)}
              onClick={handleEditCont}
            >
              {/* <Button>Edit</Button> */}
              Edit
            </div>
          ),
          key: "edit",
        },
        {
          label: (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "red",
                  colorLink: "red",
                  colorLinkHover: "#ff3737",
                  colorLinkActive: "red",
                  // colorPrimaryBg: '#1C4E84',
                },
              }}
            >
              <Popconfirm
                key={i}
                title="Delete content"
                description="Are you sure to delete this content?"
                onConfirm={() => dispatch(removingContent({ params: cont?.contentId }))}
                okText="Yes"
                okButtonProps={{ type: "default" }}
                cancelText="Cancel"
                className=" flex justify-center items-center"
              >
                <Button type="link">Delete</Button>
              </Popconfirm>
            </ConfigProvider>
          ),
          key: "delete",
        },
      ];

      // console.log(cont.contentId);

      return (
        <div key={i} className=" flex items-center">
          <div className=" flex gap-5 p-10">
            <Dropdown className="" menu={{ items }} trigger={["click"]}>
              <Button icon={<DownOutlined />}>Action</Button>
            </Dropdown>
          </div>
          {cont.type === "text" && (
            <div className=" py-5 px-10">
              <p>{cont.value}</p>
            </div>
          )}
          {cont.type === "image" && (
            <div className=" py-5 px-10">
              <Image width={250} height={150} src={`${import.meta.env.VITE_BASE_URL}/${cont?.value}`} alt="/" />
            </div>
          )}
          {cont.type === "video" && (
            <div className=" py-5 px-10">
              <video
                width={300}
                // autoPlay={true}
                loop={true}
                // muted={true}
                controls={true}
                // height={250}
                src={`${import.meta.env.VITE_BASE_URL}/${cont?.value}`}
              />
            </div>
          )}
        </div>
      );
    });
    const render = (
      <div className="flex gap-5" key={i}>
        <Button type="link" onClick={handleAddContent}>
          Add Content
        </Button>
        <Button onClick={handleEdit} type="link">
          Edit
        </Button>
        {/* <Link
        //   to={`/news/${news.id}`}
          // target="_blank" rel="noopener noreferrer"
        > */}
        <Button
          // onClick={handleEdit}
          onClick={() => {
            setIsOpenPreview(true);
            setIdParams(news.id);
          }}
          type="link"
        >
          Preview
        </Button>
        {/* </Link> */}
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "red",
              colorLink: "red",
              colorLinkHover: "#ff3737",
              colorLinkActive: "red",
              // colorPrimaryBg: '#1C4E84',
            },
          }}
        >
          <Popconfirm
            key={i}
            title="Delete news"
            description="Are you sure to delete this news?"
            okButtonProps={{ type: "default" }}
            onConfirm={() => dispatch(removingNews({ params: news?.newsId }))}
            okText="Yes"
            cancelText="Cancel"
          >
            <Button type="link">Delete</Button>
          </Popconfirm>
        </ConfigProvider>
      </div>
    );

    return {
      key: i + 1,
      headline: news.headline,
      date: date,
      coverUrl: cover,
      render,
      description,
    };
  });

  const columns = [
    {
      title: "Headline",
      dataIndex: "headline",
      key: "headline",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortDirections: ["ascend"],
    },
    {
      title: "Cover Image",
      dataIndex: "coverUrl",
      key: "coverUrl",
    },
    {
      title: "Action",
      dataIndex: "render",
      key: "render",
    },
  ];

  return (
    // <ConfigProvider theme={{ token: { colorPrimary: "#1C4E84", colorPrimaryBg: "#1C4E84" } }}>
    <div className=" relative">
      <EditNewsForm
        setImageEditPreview={setImageEditPreview}
        setFileEdit={setFileEdit}
        imageEditPreview={imageEditPreview}
        isOpenEdit={isOpenEdit}
        setIsOpenEdit={setIsOpenEdit}
        formEdit={formEdit}
        setMainEdit={setMainEdit}
        mainEdit={mainEdit}
        setNewsId={setNewsId}
        newsId={newsId}
        fileEdit={fileEdit}
        isLoading={isLoading}
        setCoverUrl={setCoverUrl}
        coverUrl={coverUrl}
        prevCover={prevCover}
      />

      <EditAddModal
        isOpenAddContent={isOpenAddContent}
        setIsOpenAddContent={setIsOpenAddContent}
        setNewsId={setNewsId}
        setSelectedType={setSelectedType}
        selectedType={selectedType}
        setContentLength={setContentLength}
        contentLength={contentLength}
        formEditAddImg={formEditAddImg}
        formEditAddText={formEditAddText}
        formEditAddVid={formEditAddVid}
        setImageUrl={setImageUrl}
        imageUrl={imageUrl}
        setVideoUrl={setVideoUrl}
        videoUrl={videoUrl}
        newsId={newsId}
        isAdd={isAdd}
        contId={contId}
      />

      <Link className=" absolute right-5 top-5 py-2 px-4 bg-primary-800 text-white rounded-lg" to="/news/add-news">
        Add news
      </Link>
      <Table
        loading={isLoading}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => record.description,
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
        dataSource={newsTable}
      />
      <Modal
        title={<h1 className=" text-2xl font-semibold">Preview News</h1>}
        open={isOpenPreview}
        width={1500}
        onCancel={handleCancelPreview}
        okButtonProps={{ style: { display: "none" } }}
        cancelText="Close"
      >
        <NewsGenerated idParams={idParams} />
      </Modal>
    </div>
    // </ConfigProvider>
  );
};

export default NewsPage;
