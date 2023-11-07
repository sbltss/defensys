import { Select } from "antd";
import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cctvActions } from "../../../../../../store/store";
const { fetchCctvStreams } = cctvActions;

const CCTV = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const videoRef = useRef(null);
  const { cctvStreams, fetchCctvStreamsLoading } = useSelector(
    (state) => state.cctv
  );
  const [cctvSrc, setCctvSrc] = useState(null);

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        dispatch(fetchCctvStreams());
      }, 500);
    }
  }, [token]);
  const hlsRef = useRef(null);
  useEffect(() => {
    if (hlsRef.current) {
      hlsRef.current.detachMedia();
      hlsRef.current.destroy();
    }
    const video = videoRef.current;
    if (video && cctvSrc) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(cctvSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = cctvSrc;
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
      }
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
      }
    };
  }, [cctvSrc]);

  return (
    <div className="h-full overflow-hidden">
      {fetchCctvStreamsLoading && <span>Fetching CCTVs...</span>}
      {!fetchCctvStreamsLoading && (
        <div className="h-full">
          <Select
            className="pb-2 w-full"
            placeholder={"Select CCTV Stream"}
            value={cctvSrc}
            onChange={(e) => setCctvSrc(e)}
          >
            {cctvStreams.map((cctv, idx) => (
              <Select.Option value={cctv.streamLink} key={idx}>
                {cctv.name}
              </Select.Option>
            ))}
          </Select>

          <div className="h-full flex flex-row justify-center">
            <video className="h-4/5" ref={videoRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CCTV;
