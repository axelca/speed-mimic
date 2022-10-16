export type MessageType = "LOGIN" | "DRAW";

export enum MessageTypeEnum {
  Login = "LOGIN",
  DrawLeader = "DRAW_LEADER",
  DrawParticipant = "DRAW_PARTICIPANT",
  AssignedUsername = "ASSIGNED_USERNAME",
  Restart = "RESTART",
  GameState = "GAME_STATE",
  Role = "ROLE",
  IsAdmin = "IS_ADMIN",
  Chat = "CHAT",
}

export interface Message {
  data: string | null;
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
