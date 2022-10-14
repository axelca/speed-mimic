import { WebSocket } from "ws";

export interface CustomWebSocket extends WebSocket {
  info: {
    id: string;
    username: string;
  }
  isAlive: boolean;
  message: number;
}

export type MessageType = "LOGIN" | "DRAW";

export enum MessageTypeEnum {
  Login = "LOGIN",
  Draw = "DRAW",
}

export interface Message {
  type: MessageTypeEnum;
}

export interface LoginMessage extends Message {
  username: string;
}

interface Coordinate {
  x: number;
  y: number;
}
export interface DrawMessage extends Message {
  coordinates: Coordinate[];
}
