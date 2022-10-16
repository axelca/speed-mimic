import { createContext, useContext, useMemo } from "react";
import useWebSocket, { ReadyState, SendMessage } from "react-use-websocket";
import {
  SendJsonMessage,
  WebSocketLike,
} from "react-use-websocket/dist/lib/types";

type WebSocketContextType = {
  getWebSocket: () => WebSocketLike | null;
  lastMessage: MessageEvent | null;
  readyState: ReadyState;
  sendJsonMessage: SendJsonMessage;
  sendMessage: SendMessage;
};

const WebSocketContext = createContext<WebSocketContextType>({
  getWebSocket: () => null,
  lastMessage: null,
  readyState: -1,
  sendMessage: () => {
    // intentional empty function
  },
  sendJsonMessage: () => {
    // intentional empty function
  },
});

const WebSocketProvider = ({ children }: { children: JSX.Element }) => {
  const { getWebSocket, lastMessage, readyState, sendJsonMessage, sendMessage } =
    useWebSocket(process.env.REACT_APP_SOCKET_URL || "");

  const value = useMemo<WebSocketContextType>(
    () => ({
      getWebSocket,
      lastMessage,
      readyState,
      sendMessage,
      sendJsonMessage,
    }),
    [getWebSocket, lastMessage, readyState, sendJsonMessage, sendMessage]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocketContext = () => useContext(WebSocketContext);

export { WebSocketContext, WebSocketProvider, useWebSocketContext };
