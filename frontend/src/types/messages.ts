export type MessageType = "LOGIN" | "DRAW";

export enum MessageTypeEnum {
  Login = "LOGIN",
  AssignedUsername = "ASSIGNED_USERNAME",
  Role = "ROLE",
  Restart = "RESTART",
  GameState = "GAME_STATE",
  Draw = "DRAW",
  IsAdmin = "IS_ADMIN",
}

export interface Message {
  data: string | Coordinate[] | null;
  type: MessageTypeEnum;
}
export interface Coordinate {
  x: number;
  y: number;
}

export enum RoleEnum {
  Participant = "PARTICIPANT",
  GameLeader = "GAME_LEADER",
}
