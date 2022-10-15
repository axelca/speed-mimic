import { FC, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Message debugger</Accordion.Header>
          <Accordion.Body>
            {messages.length ? (
              <ul>
                {messages.map(({ data, timeStamp }) => (
                  <Message key={`${data}-${timeStamp}`} message={data} />
                ))}
              </ul>
            ) : (
              <div>no messages yet :(</div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Messages;
