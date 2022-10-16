export type MessageType = "LOGIN" | "DRAW";

export enum MessageTypeEnum {
  Login = "LOGIN",
  DrawLeader = "DRAW_LEADER",
  DrawParticipant = "DRAW_PARTICIPANT",
  AssignedUsername = "ASSIGNED_USERNAME",
  Restart = "RESTART",
  GameState = "GAME_STATE",
}

export interface Message {
  data: string | null;
  type: MessageTypeEnum;
}
export interface Coordinate {
  x: number;
  y: number;
}
