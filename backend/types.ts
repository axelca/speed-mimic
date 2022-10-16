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
  DrawLeader = "DRAW_LEADER",
  DrawParticipant = "DRAW_PARTICIPANT",
  AssignedUsername = "ASSIGNED_USERNAME",
  Role = "ROLE",
  Restart = "RESTART",
  GameState = "GAME_STATE",
  IsAdmin = "IS_ADMIN",
  Chat = "CHAT"
}

export interface Message {
  type: MessageTypeEnum;
  data?: any;
}

export enum RoleEnum {
  Participant = "PARTICIPANT",
  GameLeader = "GAME_LEADER"
}

export enum GameStateEnum {
  Paused = "PAUSED",
  GameLeaderDraws = "GAME_LEADER_DRAWS",
  ParticipantsDraw = "PARTICIPANTS_DRAW",
  Review = "REVIEW",
}


