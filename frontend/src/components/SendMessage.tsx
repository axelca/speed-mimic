import { ChangeEvent, FC, FormEvent, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { useWebSocketContext } from "../contexts/WebSocketContext";

const SendMessage: FC = () => {
  const [message, setMessage] = useState("");
  const { readyState, sendMessage } = useWebSocketContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setMessage(event.target.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} type="text" value={message} />
      <button disabled={readyState !== ReadyState.OPEN} type="submit">
        Send message
      </button>
    </form>
  );
};

export default SendMessage;
