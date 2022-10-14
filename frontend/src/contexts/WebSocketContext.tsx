import { createContext, useContext, useMemo } from "react";
import useWebSocket, { ReadyState, SendMessage } from "react-use-websocket";

type WebSocketContextType = {
  lastMessage: MessageEvent | null;
  readyState: ReadyState;
  sendMessage: SendMessage;
};

const WebSocketContext = createContext<WebSocketContextType>({
  lastMessage: null,
  readyState: -1,
  sendMessage: () => {
    // intentional empty function
  },
});

const WebSocketProvider = ({ children }: { children: JSX.Element }) => {
  const { lastMessage, readyState, sendMessage } = useWebSocket(
    process.env.REACT_APP_SOCKET_URL || ""
  );

  const value = useMemo<WebSocketContextType>(
    () => ({
      lastMessage,
      readyState,
      sendMessage,
    }),
    [lastMessage, readyState, sendMessage]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocketContext = () => useContext(WebSocketContext);

export { WebSocketContext, WebSocketProvider, useWebSocketContext };
