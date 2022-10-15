import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useWebSocket, { ReadyState, SendMessage } from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { GameStateEnum } from "../types/gameState";
import { MessageTypeEnum, RoleEnum } from "../types/messages";

const defaultRole = RoleEnum.Participant;
const defaultIsAdmin = false;
const defaultGameState = GameStateEnum.Paused;
const defaultUsername = "";

type WebSocketContextType = {
  gameState: GameStateEnum;
  isAdmin: boolean;
  lastMessage: MessageEvent | null;
  readyState: ReadyState;
  role: RoleEnum;
  sendJsonMessage: SendJsonMessage;
  sendMessage: SendMessage;
  username: string;
};

const WebSocketContext = createContext<WebSocketContextType>({
  gameState: defaultGameState,
  lastMessage: null,
  readyState: -1,
  sendMessage: () => {
    // intentional empty function
  },
  sendJsonMessage: () => {
    // intentional empty function
  },
  role: defaultRole,
  isAdmin: defaultIsAdmin,
  username: defaultUsername,
});

const WebSocketProvider = ({ children }: { children: JSX.Element }) => {
  const [username, setUsername] = useState(defaultUsername);
  const [role, setRole] = useState(defaultRole);
  const [isAdmin, setIsAdmin] = useState(defaultIsAdmin);
  const [gameState, setGameState] = useState(defaultGameState);

  const { lastMessage, readyState, sendJsonMessage, sendMessage } =
    useWebSocket(process.env.REACT_APP_SOCKET_URL || "");

  const value = useMemo<WebSocketContextType>(
    () => ({
      lastMessage,
      readyState,
      sendMessage,
      sendJsonMessage,
      role,
      isAdmin,
      gameState,
      username,
    }),
    [
      lastMessage,
      readyState,
      sendMessage,
      sendJsonMessage,
      role,
      isAdmin,
      gameState,
      username,
    ]
  );

  useEffect(() => {
    if (!lastMessage?.data) {
      return;
    }

    const parsedData = JSON.parse(lastMessage.data);

    if (parsedData.type === MessageTypeEnum.Role) {
      setRole(parsedData.data);
    }
  }, [lastMessage?.data, lastMessage?.type]);

  useEffect(() => {
    if (!lastMessage?.data) {
      return;
    }

    const parsedData = JSON.parse(lastMessage.data);

    if (parsedData.type === MessageTypeEnum.IsAdmin) {
      setIsAdmin(parsedData.data);
    }
  }, [lastMessage?.data, lastMessage?.type]);

  useEffect(() => {
    if (!lastMessage?.data) {
      return;
    }

    const parsedData = JSON.parse(lastMessage.data);

    if (parsedData.type === MessageTypeEnum.GameState) {
      setGameState(parsedData.data);
    }
  }, [lastMessage?.data, lastMessage?.type]);

  useEffect(() => {
    if (!lastMessage?.data) {
      return;
    }

    const parsedData = JSON.parse(lastMessage.data);

    if (parsedData.type === MessageTypeEnum.AssignedUsername) {
      setUsername(parsedData.data);
    }
  }, [lastMessage?.data, lastMessage?.type]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocketContext = () => useContext(WebSocketContext);

export { WebSocketContext, WebSocketProvider, useWebSocketContext };
