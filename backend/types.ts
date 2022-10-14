import { WebSocket } from "ws";

export interface CustomWebSocket extends WebSocket {
  info: {
    id: string;
    username: string;
  }
  isAlive: boolean;
  message: number;
}