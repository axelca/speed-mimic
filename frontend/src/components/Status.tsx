import { FC } from "react";
import { getConnectionStatus } from "../utils";
import { useWebSocketContext } from "../contexts/WebSocketContext";

const Status: FC = () => {
  const { readyState } = useWebSocketContext();

  return <div>Connection status: {getConnectionStatus(readyState)}</div>;
};

export default Status;
