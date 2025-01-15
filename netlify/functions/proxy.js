const express = require('express');
const WebSocket = require('ws');
const http = require('http');

// Create an Express server
const app = express();
const server = http.createServer(app);

// Create WebSocket server that listens for incoming WebSocket connections
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Create WebSocket connection to the target server
  const targetSocket = new WebSocket('wss://filaments.hrfee.pw/socket');

  // Relay messages from the client to the target WebSocket server
  ws.on('message', (message) => {
    targetSocket.send(message);
  });

  // Relay messages from the target WebSocket server back to the client
  targetSocket.on('message', (message) => {
    ws.send(message);
  });

  // Close connections when either side closes
  ws.on('close', () => targetSocket.close());
  targetSocket.on('close', () => ws.close());
});

// Start the HTTP server on port 8080
server.listen(8080, () => {
  console.log('WebSocket Proxy server running on ws://localhost:8080');
});
