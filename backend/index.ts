'use strict';

import * as webSocket from "ws";
import * as http from "http";
import { v4 } from 'uuid';
import { CustomWebSocket } from "./types";

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
  ws.on('message', message);
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

function message(data: webSocket.RawData, isBinary: boolean) {
  const enc = new TextDecoder('utf-8');
  const decodedData = enc.decode(data as ArrayBuffer);
  const parsedJson = JSON.parse(decodedData);

  if (parsedJson.type === 'LOGIN') {
    const username = parsedJson.username;
    this.info.username = generateUsername(username, 0);
  }

  this.isAlive = true;
  this.message++;

  wss.clients.forEach((client: CustomWebSocket) => {
    console.log(client.info);
  });

  wss.clients.forEach((client) => {
    if (client.readyState === webSocket.OPEN) {
      client.send(data, { binary: isBinary }, (err) => {
        if (err) {
          return;
        }

        if (--this.message === 0 && this.isPaused) {
          this.resume();
        }
      });
    }
  });

  if (this.bufferedAmount >= highWaterMark && !this.isPaused) {
    this.pause();

    // This is used only for testing.
    this.emit('pause');
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
