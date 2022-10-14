import { ChangeEvent, FC, FormEvent, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { JsonObject } from "react-use-websocket/dist/lib/types";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { LoginMessage, MessageTypeEnum } from "../types/messages";

const Login: FC = () => {
  const [username, setUsername] = useState("");
  const { readyState, sendJsonMessage } = useWebSocketContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username) {
      const loginMessage: LoginMessage = {
        type: MessageTypeEnum.Login,
        username,
      };
      sendJsonMessage(loginMessage as unknown as JsonObject);
      setUsername("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} type="text" value={username} />
      <button disabled={readyState !== ReadyState.OPEN} type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
