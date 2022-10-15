import { FC } from "react";
import { JsonObject } from "react-use-websocket/dist/lib/types";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { GameStateEnum } from "../types/gameState";
import { Message, MessageTypeEnum } from "../types/messages";

const Restart: FC = () => {
  const { gameState, isAdmin, sendJsonMessage } = useWebSocketContext();

  const handleClick = () => {
    const restartMessage: Message = {
      type: MessageTypeEnum.Restart,
      data: null,
    };
    sendJsonMessage(restartMessage as unknown as JsonObject);
  };

  return (
    <button disabled={!isAdmin} onClick={handleClick} type="button">
      {gameState === GameStateEnum.Paused ? "Start" : "Restart"}
    </button>
  );
};

export default Restart;
