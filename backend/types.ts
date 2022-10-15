import { WebSocket } from "ws";

export interface CustomWebSocket extends WebSocket {
  info: {
    id: string;
    username: string;
    isAdmin: boolean;
    role: RoleEnum;
  }
  isAlive: boolean;
  message: number;
}

export enum MessageTypeEnum {
  Login = "LOGIN",
  AssignedUsername = "ASSIGNED_USERNAME",
  Role = "ROLE",
  Restart = "RESTART",
  GameState = "GAME_STATE",
  Draw = "DRAW",
  IsAdmin = "IS_ADMIN",
}

interface Coordinate {
  x: number;
  y: number;
}

export interface Message {
  type: MessageTypeEnum;
  data: string | Coordinate[] | boolean;
}

export enum GameStateEnum {
  Paused = "PAUSED",
  GameLeaderDraws = "GAME_LEADER_DRAWS",
  ParticipantsDraw = "PARTICIPANTS_DRAW",
  Review = "REVIEW",
}

export enum RoleEnum {
  Participant = "PARTICIPANT",
  GameLeader = "GAME_LEADER"
}


