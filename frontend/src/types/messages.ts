export type MessageType = "LOGIN" | "DRAW";

export enum MessageTypeEnum {
  Login = "LOGIN",
  Draw = "DRAW",
}

interface Message {
  type: MessageTypeEnum;
}

export interface LoginMessage extends Message {
  username: string;
}

export interface Coordinate {
  x: number;
  y: number;
}
export interface DrawMessage extends Message {
  coordinates: Coordinate[];
}
