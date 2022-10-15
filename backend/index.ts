'use strict';

import * as webSocket from "ws";
import * as http from "http";
import { v4 } from 'uuid';
import { CustomWebSocket, GameStateEnum, Message, MessageTypeEnum } from "./types";
import { jsonToRawData, rawDataToJson } from "./utils";

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

const handleRestartMessage = (client: CustomWebSocket) => {
  console.log('client.info', client.info);
  if (client.readyState === webSocket.OPEN && client.info.isAdmin) {
    gameState = GameStateEnum.Started;
  }
  console.log({ gameState });
}

const handleRestartMessageAnswer = () => {
  wss.clients.forEach((client) => {
    if (client.readyState === webSocket.OPEN) {
      // client.send(jsonToRawData({ type: MessageTypeEnum.GameState, data: GameStateEnum.Started }));
    }
  });
}

const handleLoginMessage = (client: CustomWebSocket, message: Message) => {
  const username = message.data;
  const assignedUsername = generateUsername(username as string, 0);
  client.info.username = assignedUsername;

  console.log({assignedUsername})

  if (assignedUsername === "axel") {
    client.info.isAdmin === true;
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
    handleRestartMessage(this);
    handleRestartMessageAnswer();
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
