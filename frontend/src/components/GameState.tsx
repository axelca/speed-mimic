import { FC } from "react";
import { useWebSocketContext } from "../contexts/WebSocketContext";

const GameState: FC = () => {
  const { gameState } = useWebSocketContext();

  return <div>Current game state: {gameState}</div>;
};

export default GameState;
