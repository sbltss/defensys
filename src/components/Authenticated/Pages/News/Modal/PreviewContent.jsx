import { Button } from "antd";
import { useEffect, useState } from "react";

export const PreviewContent = ({ preview, index, handleDeleteClick, handleEditClick }) => {
  const [converted, setConverted] = useState(null);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });
  useEffect(() => {
    const convertBaseUrl = async (e) => {
      setConverted(await getBase64(e));
    };
    if (preview.type === "image" || preview.type === "video") convertBaseUrl(preview.value.file);
  }, [preview]);
  if (preview.type === "text") {
    return (
      <div className=" col-span-4 px-4 " key={index}>
        <p className="text-justify sm:text-lg text-base text-[#313553] ">{preview.value}</p>
        <div className=" flex gap-5 justify-center">
          <Button className="" onClick={() => handleDeleteClick(index)} type="primary">
            Delete
          </Button>
          <Button className="" onClick={() => handleEditClick(preview)} type="primary">
            Edit
          </Button>
        </div>
      </div>
    );
  } else if (preview.type === "image") {
    return (
      <div
        className="md:col-span-2 col-span-4 flex flex-col justify-center items-center gap-y-2 sm:px-0 px-4 "
        key={index}
      >
        {/* <div className=" sm:px-0 px-4 max-w-[700px] h-full relative"> */}
        {converted && <img className=" w-full h-full object-fill rounded-lg" alt="/" src={converted} />}
        {/* </div> */}
        <Button type="primary" className=" px-10" onClick={() => handleDeleteClick(index)}>
          Delete
        </Button>
      </div>
    );
  } else if (preview.type === "video") {
    return (
      <div className="col-span-4 flex justify-center items-center " key={index}>
        <div className=" xl:px-32 sm:px-10 px-4">
          {converted && (
            <video
              className=" w-full"
              // autoPlay={true}
              loop={true}
              // muted={true}
              controls={true}
              src={converted}
            />
          )}
          <Button className="mt-4" onClick={() => handleDeleteClick(index)} type="primary">
            Delete
          </Button>
          {/* <Button className="" onClick={() => handleEditClick(preview)}>
						Edit
					</Button> */}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
