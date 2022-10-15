import { WebSocketServer } from "ws";
import { CustomWebSocket, Message } from "./types";

export const rawDataToJson = (rawData: ArrayBuffer | Buffer | Buffer[]): Message => {
  const decoder = new TextDecoder('utf-8');
  const decodedData = decoder.decode(rawData as ArrayBuffer);
  return JSON.parse(decodedData) as Message;
}

export function jsonToRawData(jsonData: Message) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(jsonData));
  return encodedData;
}

export const generateUsername = (username: string, i: number, wss: WebSocketServer) => {
  let isUsernameTaken = false;

  for (const client of wss.clients) {
    const customClient = client as CustomWebSocket;

    if (customClient.info.username === username) {
      isUsernameTaken = true;
      break;
    }
  }

  if (!isUsernameTaken) {
    return username;
  }

  return generateUsername(`${username}${i}`, i + 1, wss);
};

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;