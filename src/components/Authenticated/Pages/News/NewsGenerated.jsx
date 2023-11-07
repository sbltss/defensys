import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNewsFetch } from "../../../../store/slices/news-slice";

const NewsGenerated = ({ idParams }) => {
  //   const { id } = useParams();

  const newsData = useSelector((state) => state.news.newsList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNewsFetch());
  }, []);
  const news = newsData.find((c) => c.id === parseInt(idParams));

  const date = moment(news?.subtitle).format("LL");

  return (
    <div className="">
      <div className=" md:px-0 px-6">
        <div className="mt-5 flex flex-col items-center justify-center bg-[#eeeeee] sm:pt-20 pt-20 sm:pb-16 pb-10">
          <div className=" flex justify-center items-center max-w-[1000px]">
            <img
              className=" w-full h-full rounded-md"
              src={`${import.meta.env.VITE_BASE_URL}/${news?.coverUrl}`}
              alt="/"
            />
          </div>
          <div className=" px-5">
            <h1 className=" text-[#1e293b] font-bold text-center mt-10 sm:text-[32px] text-[24px]">{news?.headline}</h1>
            <p className=" text-defblue text-center sm:text-[16px] text-[14px]">{date}</p>
          </div>
        </div>
      </div>
      <div className=" bg-[#F8F9F9] sm:py-0 py-0">
        <div className=" container mx-auto grid grid-cols-4 sm:gap-10 gap-5 bg-white shadow-xl sm:px-20 px-2 lg:py-20 md:py-20 py-20 rounded-lg">
          {news?.contents?.map((content, i) => {
            if (content.type === "text") {
              return (
                <div className=" col-span-4 px-4 " key={i}>
                  <p className="text-justify sm:text-lg text-base text-[#313553] ">{content.value}</p>
                </div>
              );
            } else if (content.type === "image") {
              return (
                <div
                  className="md:col-span-2 col-span-4 flex flex-col justify-center items-center gap-y-2 sm:px-0 px-4 max-h-[500px]"
                  key={i}
                >
                  {/* <div className=" sm:px-0 px-4 max-w-[700px] h-full relative"> */}
                  <img
                    className=" w-full h-full object-cover rounded-lg"
                    alt="/"
                    src={`${import.meta.env.VITE_BASE_URL}/${content.value}`}
                  />
                  {/* </div> */}
                </div>
              );
            } else if (content.type === "video") {
              return (
                <div className="col-span-4 flex justify-center items-center " key={i}>
                  <div className=" xl:px-32 sm:px-10 px-4">
                    <video
                      className=" w-full"
                      // autoPlay={true}
                      loop={true}
                      // muted={true}
                      controls={true}
                      src={`${import.meta.env.VITE_BASE_URL}/${content.value}`}
                    />
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default NewsGenerated;
