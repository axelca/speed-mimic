'use strict';

const http = require('http');
const WebSocket = require('ws');
const v4 = require('uuid').v4;

const server = http.createServer();

server.on('request', function request(req, res) {
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

const wss = new WebSocket.Server({
  maxPayload: +env.MAX_MESSAGE_SIZE || 64 * 1024,
  server
});

wss.on('connection', function connection(ws) {
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

const generateUsername = (username, i) => {
  let isUsernameTaken = false;

  for (const client of wss.clients) {
    if (client.info.username === username) {
      isUsernameTaken = true;
      break;
    }
  }

  if (!isUsernameTaken) {
    return username;
  }

  return generateUsername(`${username}${i}`, i + 1);
};

function message(data, binary) {
  const client = this;
  const enc = new TextDecoder('utf-8');
  const decodedData = enc.decode(data);
  const parsedJson = JSON.parse(decodedData);

  if (parsedJson.type === 'LOGIN') {
    console.log(parsedJson.type);
    const username = parsedJson.username;
    client.info.username = generateUsername(username, 0);
  }

  client.isAlive = true;
  client.message++;

  wss.clients.forEach((client) => {
    console.log(client.info);
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data, { binary }, (err) => {
        /* istanbul ignore if */
        if (err) {
          return;
        }

        if (--client.message === 0 && client.isPaused) {
          client.resume();
        }
      });
    }
  });

  if (client.bufferedAmount >= highWaterMark && !client.isPaused) {
    client.pause();

    // This is used only for testing.
    client.emit('pause');
  }
}

function heartbeat() {
  this.isAlive = true;
}

setInterval(function interval() {
  for (const ws of wss.clients) {
    if (ws.isAlive === false) {
      ws.terminate();
      continue;
    }

    ws.isAlive = false;
    ws.ping();
  }
}, +env.HEARTBEAT_INTERVAL || 30000).unref();

if (require.main === module) {
  server.on('listening', function listening() {
    const { address, family, port } = server.address();
    console.log(
      'Server listening on %s:%d',
      family === 'IPv6' ? `[${address}]` : address,
      port
    );
  });

  server.listen(+env.BIND_PORT || 8000, env.BIND_ADDRESS || '::');
}

module.exports = { server, wss };
