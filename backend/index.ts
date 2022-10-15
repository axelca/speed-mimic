'use strict';

import * as webSocket from "ws";
import * as http from "http";
import { v4 } from 'uuid';
import { CustomWebSocket, GameStateEnum, Message, MessageTypeEnum, RoleEnum } from "./types";
import { generateUsername, getRandomInt, jsonToRawData, rawDataToJson } from "./utils";
import { admins } from "./constants";

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

let gameState = GameStateEnum.Paused;

const wss = new webSocket.Server({
  maxPayload: +env.MAX_MESSAGE_SIZE || 64 * 1024,
  server
});

wss.on('connection', (ws: CustomWebSocket) => {
  ws.info = {
    id: v4(),
    username: undefined,
    isAdmin: false,
    role: RoleEnum.Participant,
  };

  ws.isAlive = true;
  ws.message = 0;

  ws.on('error', console.error);
  ws.on('message', handleMessage);
  ws.on('pong', heartbeat);
});

const handleRestartMessage = (ws: CustomWebSocket, isBinary: boolean) => {
  if (ws.readyState !== webSocket.OPEN || !ws.info.isAdmin) {
    return;
  }

  const clients = wss.clients as Set<CustomWebSocket>; 
  const clientsArray = Array.from(clients);
  const randomIndex = getRandomInt(0, clientsArray.length - 1);
  const randomUserId = clientsArray[randomIndex].info.id;

  clients.forEach((client) => {
    if (client.readyState === webSocket.OPEN) {
      if (client.info.id === randomUserId) {
        client.info.role = RoleEnum.GameLeader
        client.send(jsonToRawData({ type: MessageTypeEnum.Role, data: RoleEnum.GameLeader }), { binary: isBinary });
      } else {
        client.info.role = RoleEnum.Participant
        client.send(jsonToRawData({ type: MessageTypeEnum.Role, data: RoleEnum.Participant }), { binary: isBinary });
      }
    }
  });
  
  gameState = GameStateEnum.GameLeaderDraws;
}

const handleRestartMessageAnswer = (isBinary: boolean) => {
  wss.clients.forEach((client) => {
    if (client.readyState === webSocket.OPEN) {
      client.send(jsonToRawData({ type: MessageTypeEnum.GameState, data: gameState }), { binary: isBinary });
    }
  });
}

const handleLoginMessage = (client: CustomWebSocket, message: Message) => {
  const username = message.data;
  const assignedUsername = generateUsername(username as string, 0, wss);
  client.info.username = assignedUsername;

  if (admins.includes(assignedUsername)) {
    client.info.isAdmin = true;
  }
}

const handleAnswerLoginMessage = (ws: CustomWebSocket, isBinary: boolean) => {
    if (ws.readyState === webSocket.OPEN) {
      ws.send(jsonToRawData({ type: MessageTypeEnum.AssignedUsername, data: ws.info.username }), { binary: isBinary });
    }
}

const handleDrawMessage = (ws: CustomWebSocket, rawData: webSocket.RawData, isBinary: boolean) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === webSocket.OPEN) {
      client.send(rawData, { binary: isBinary });
    }
  });
}

function handleMessage(rawData: webSocket.RawData, isBinary: boolean) {
  const data = rawDataToJson(rawData);

  if (data.type === MessageTypeEnum.Restart) {
    handleRestartMessage(this, isBinary);
    handleRestartMessageAnswer(isBinary);
  }

  if (data.type === MessageTypeEnum.Login) {
    handleLoginMessage(this, data as Message);
    handleAnswerLoginMessage(this, isBinary);
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
