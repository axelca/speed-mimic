'use strict';

import * as webSocket from "ws";
import * as http from "http";
import { v4 } from 'uuid';
import { CustomWebSocket, LoginMessage, Message, MessageTypeEnum } from "./types";

const server = http.createServer();

server.on('request', (_req, res) => {
  const body = http.STATUS_CODES[426];

  res.writeHead(426, {
    Connection: 'close',
    'Content-Length': body.length,
    'Content-Type': 'text/plain'
  });

  res.end(body);
});

const { env } = process;
const highWaterMark = +env.HIGH_WATER_MARK || 16384;

const wss = new webSocket.Server({
  maxPayload: +env.MAX_MESSAGE_SIZE || 64 * 1024,
  server
});

wss.on('connection', (ws: CustomWebSocket) => {
  ws.info = {
    id: v4(),
    username: undefined
  };

  ws.isAlive = true;
  ws.message = 0;

  ws.on('error', console.error);
  ws.on('message', handleMessage);
  ws.on('pong', heartbeat);
});

const generateUsername = (username: string, i: number) => {
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

  return generateUsername(`${username}${i}`, i + 1);
};

const handleLoginMessage = (client: CustomWebSocket, data: LoginMessage) => {
  const username = data.username;
  client.info.username = generateUsername(username, 0);
}

const handleDrawMessage = (ws: CustomWebSocket, rawData: webSocket.RawData, isBinary: boolean) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === webSocket.OPEN) {
      client.send(rawData, { binary: isBinary });
    }
  });
}

const rawDataToJson = (rawData: webSocket.RawData): Message => {
  const enc = new TextDecoder('utf-8');
  const decodedData = enc.decode(rawData as ArrayBuffer);
  return JSON.parse(decodedData) as Message;
}

function handleMessage(rawData: webSocket.RawData, isBinary: boolean) {
  const data = rawDataToJson(rawData);

  if (data.type === MessageTypeEnum.Login) {
    handleLoginMessage(this, data as LoginMessage);
  }

  if (data.type === MessageTypeEnum.Draw) {
    handleDrawMessage(this, rawData, isBinary);
  }
}

function heartbeat() {
  this.isAlive = true;
}

setInterval(function interval() {
  for (const client of wss.clients) {
    const customClient = client as CustomWebSocket;

    if (customClient.isAlive === false) {
      customClient.terminate();
      continue;
    }

    customClient.isAlive = false;
    customClient.ping();
  }
}, +env.HEARTBEAT_INTERVAL || 30000).unref();

const port = +env.BIND_PORT || 8000;

if (require.main === module) {
  server.on('listening', function listening() {
    console.log(`server listening on port`, port);
  });

  server.listen(port, env.BIND_ADDRESS || '::');
}

module.exports = { server, wss };
