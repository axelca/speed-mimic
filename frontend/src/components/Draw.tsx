import { FC, FormEvent, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { JsonObject } from "react-use-websocket/dist/lib/types";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { Coordinate, Message, MessageTypeEnum } from "../types/messages";

const Draw: FC = () => {
  const [coordinates] = useState<Coordinate[]>([{ x: 1, y: 2 }]);
  const { readyState, sendJsonMessage } = useWebSocketContext();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (coordinates.length) {
      const drawMessage: Message = {
        type: MessageTypeEnum.DrawLeader,
        data: null
      };
      sendJsonMessage(drawMessage as unknown as JsonObject);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={readyState !== ReadyState.OPEN} type="submit">
        send coordinates for drawing
      </button>
    </form>
  );
};

export default Draw;
