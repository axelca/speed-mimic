import { FC, FormEvent, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { JsonObject } from "react-use-websocket/dist/lib/types";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { Message, MessageTypeEnum } from "../types/messages";

const Chat: FC = () => {
  const { lastMessage, sendJsonMessage } = useWebSocketContext();
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentMessage) {
      const chatMessage: Message = {
        type: MessageTypeEnum.Chat,
        data: currentMessage,
      };
      sendJsonMessage(chatMessage as unknown as JsonObject);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    if (!lastMessage?.data) {
      return;
    }

    const parsedData = JSON.parse(lastMessage.data);

    if (parsedData.type === MessageTypeEnum.Chat) {
      setChatMessages((prevState) => [...prevState, parsedData.data]);
    }
  }, [lastMessage?.data, lastMessage?.type]);

  return (
    <>
      <div>Chat</div>
      <Container id="ChatContent">
        {chatMessages.map((message) => (
          <Row key={message}>{message}</Row>
        ))}
      </Container>
      <Form onSubmit={handleSubmit}>
        <Container id="ChatControl">
          <Row>
            <Col md="10">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  onChange={(event) => setCurrentMessage(event.target.value)}
                  placeholder="Write text here"
                  type="text"
                  value={currentMessage}
                />
              </Form.Group>
            </Col>
            <Col md="2">
              <Button type="submit" variant="primary">
                Send
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
    </>
  );
};

export default Chat;
