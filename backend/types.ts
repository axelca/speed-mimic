import { WebSocket } from "ws";

export interface CustomWebSocket extends WebSocket {
  info: {
    id: string;
    username: string;
    isAdmin: boolean;
  }
  isAlive: boolean;
  message: number;
}

export enum MessageTypeEnum {
  Login = "LOGIN",
  AssignedUsername = "ASSIGNED_USERNAME",
  Restart = "RESTART",
  GameState = "GAME_STATE",
  Draw = "DRAW",
}

interface Coordinate {
  x: number;
  y: number;
}

export interface Message {
  type: MessageTypeEnum;
  data: string | Coordinate[];
}

export enum GameStateEnum {
  Paused = "PAUSED",
  Started = "STARTED"
}


