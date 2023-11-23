import { Nvr } from "hikvision-api";
import React, { useEffect } from "react";

const CCTV = () => {
  useEffect(() => {
    const nvr = new Nvr({
      // ip: "192.168.3.52",
      ip: "192.168.2.47",
      user: "admin",
      password: "Dynamic2014",
      // proxy: 'http://127.0.0.1:8080',
      version: 2,
    });
    const connectToNvr = async () => {
      try {
        await nvr.connect();
      } catch (err) {
        console.log(err);
      }
    };
    connectToNvr();
  }, []);
  return <div>CCTV</div>;
};

export default CCTV;
