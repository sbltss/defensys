import React from "react";
import { newsData } from "../../../constants/static";

const NewsGenerated = () => {
  // console.log(newsData.content);
  return (
    <div className=" container mx-auto px-5 pt-16">
      {newsData.map((obj) => {
        return (
          <div className=" flex flex-col items-center py-20" key={obj.id}>
            <div className=" max-w-[800px]">
              <img className=" w-full" src={obj.coverURL} alt="/" />
            </div>
            <h1 className=" text-[#1e293b] font-bold text-center mt-10 sm:text-[32px] text-[24px]">{obj.headline}</h1>
            <h3 className=" text-defblue text-center sm:text-[16px] text-[14px]">{obj.subtitle}</h3>
            {obj.content.map((content, i) => {
              if (content.type === "text") {
                let cssText = `text-[${content.fontSize}] text-[${content.fontcolor}]`;
                // console.log(JSON.parse(content.containerStyle));
                // Perform action for text type
                return (
                  <div className={content.containerClass} style={JSON.parse(content.containerStyle)} key={i}>
                    {/* Render text content */}
                    <p className={content.class} style={JSON.parse(content.style)}>
                      {content.value}
                    </p>
                    {/* Additional actions for text type */}
                    {/* ... */}
                  </div>
                );
              } else if (content.type === "image") {
                // Perform action for image type
                return (
                  <div key={i}>
                    {/* Render image content */}
                    <img src={content.value} alt={` ${i}`} />
                    {/* Additional actions for image type */}
                    {/* ... */}
                  </div>
                );
              } else if (content.type === "video") {
                // Perform action for video type
                return (
                  <div key={i}>
                    {/* Render video content */}
                    <video src={content.value} controls autoPlay={false} loop={false} muted={false} />
                    {/* Additional actions for video type */}
                    {/* ... */}
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

export default NewsGenerated;
