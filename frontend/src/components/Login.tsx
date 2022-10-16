import { ChangeEvent, FC, FormEvent, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { JsonObject } from "react-use-websocket/dist/lib/types";
import { Form, Button } from "react-bootstrap";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { Message, MessageTypeEnum } from "../types/messages";

const Login: FC = () => {
  const [username, setUsername] = useState("");
  const { readyState, sendJsonMessage } = useWebSocketContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username) {
      const loginMessage: Message = {
        type: MessageTypeEnum.Login,
        data: username,
      };
      sendJsonMessage(loginMessage as unknown as JsonObject);
      setUsername("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "300px",
        }}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Enter your username</Form.Label>
          <Form.Control onChange={handleChange} type="text" value={username} />
        </Form.Group>
        <Button
          disabled={readyState !== ReadyState.OPEN}
          type="submit"
          variant="primary"
        >
          Log in
        </Button>
      </Form>
    </div>
  );
};

export default Login;
