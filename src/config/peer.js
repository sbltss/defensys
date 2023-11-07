import { Peer } from "peerjs";

const ConnectPeer = (agentId) => {
  const peer = new Peer(agentId, {
    host: "command-center.defensys.ph",
    port: "5000",
    path: "/",
    secure: true,
  });
  return peer;
};
export default ConnectPeer;
