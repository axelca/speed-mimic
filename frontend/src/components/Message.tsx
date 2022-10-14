import { FC } from "react";

interface Props {
  message: string;
}

const Message: FC<Props> = ({ message }) => <li>{message}</li>;

export default Message;
