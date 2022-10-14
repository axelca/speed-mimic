import { FC, useEffect, useState } from "react";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import Message from "./Message";

const Messages: FC = () => {
  const [messages, setMessages] = useState<MessageEvent<string>[]>([]);
  const { lastMessage } = useWebSocketContext();

  useEffect(() => {
    if (lastMessage) {
      setMessages((prevState) => [...prevState, lastMessage]);
    }
  }, [lastMessage, setMessages]);

  return (
    <div>
      {messages.length ? (
        <ul>
          {messages.map(({ data, timeStamp }) => (
            <Message key={`${data}-${timeStamp}`} message={data} />
          ))}
        </ul>
      ) : (
        <div>no messages yet :(</div>
      )}
    </div>
  );
};

export default Messages;
