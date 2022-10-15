export type MessageType = "LOGIN" | "DRAW";

export enum MessageTypeEnum {
  Login = "LOGIN",
  Draw = "DRAW",
  Restart = "RESTART",
}

export interface Message {
  data: string | Coordinate[] | null;
  type: MessageTypeEnum;
}
export interface Coordinate {
  x: number;
  y: number;
}
