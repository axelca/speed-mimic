import { FC } from "react";
import { JsonObject } from "react-use-websocket/dist/lib/types";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { Message, MessageTypeEnum } from "../types/messages";

const Restart: FC = () => {
  const { sendJsonMessage } = useWebSocketContext();

  const handleClick = () => {
    const restartMessage: Message = {
      type: MessageTypeEnum.Restart,
      data: null,
    };
    sendJsonMessage(restartMessage as unknown as JsonObject);
  };

  return (
    <button onClick={handleClick} type="button">
      Restart
    </button>
  );
};

export default Restart;
