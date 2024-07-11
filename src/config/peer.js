import { Peer } from "peerjs";

const ConnectPeer = (agentId) => {
  const peer = new Peer(agentId, {
    host: "office.dynamicglobalsoft.com",
    port: "1180",
    path: "/",
    secure: true,
  });
  return peer;
};
export default ConnectPeer;
