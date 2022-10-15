import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useWebSocket, { ReadyState, SendMessage } from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { MessageTypeEnum, RoleEnum } from "../types/messages";

const defaultRole = RoleEnum.Participant;
const defaultIsAdmin = false;

type WebSocketContextType = {
  isAdmin: boolean;
  lastMessage: MessageEvent | null;
  readyState: ReadyState;
  role: RoleEnum;
  sendJsonMessage: SendJsonMessage;
  sendMessage: SendMessage;
};

const WebSocketContext = createContext<WebSocketContextType>({
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
});

const WebSocketProvider = ({ children }: { children: JSX.Element }) => {
  const [role, setRole] = useState(defaultRole);
  const [isAdmin, setIsAdmin] = useState(defaultIsAdmin);

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
    }),
    [lastMessage, readyState, sendMessage, sendJsonMessage, role, isAdmin]
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

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocketContext = () => useContext(WebSocketContext);

export { WebSocketContext, WebSocketProvider, useWebSocketContext };
