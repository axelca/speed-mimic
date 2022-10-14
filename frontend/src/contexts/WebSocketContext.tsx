import { createContext, useContext, useMemo } from "react";
import useWebSocket, { ReadyState, SendMessage } from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

type WebSocketContextType = {
  lastMessage: MessageEvent | null;
  readyState: ReadyState;
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
});

const WebSocketProvider = ({ children }: { children: JSX.Element }) => {
  const { lastMessage, readyState, sendJsonMessage, sendMessage } =
    useWebSocket(process.env.REACT_APP_SOCKET_URL || "");

  const value = useMemo<WebSocketContextType>(
    () => ({
      lastMessage,
      readyState,
      sendMessage,
      sendJsonMessage,
    }),
    [lastMessage, readyState, sendMessage, sendJsonMessage]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocketContext = () => useContext(WebSocketContext);

export { WebSocketContext, WebSocketProvider, useWebSocketContext };
