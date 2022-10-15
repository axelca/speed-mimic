import { Message } from "./types";

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