const WebSocket = require('ws');

exports.handler = async (event, context) => {
  if (event.headers['Upgrade'] !== 'websocket') {
    return {
      statusCode: 400,
      body: 'Invalid WebSocket request',
    };
  }

  // Connect to the target WebSocket server
  const targetSocket = new WebSocket('wss://filaments.hrfee.pw/socket');

  // Accept the WebSocket connection from the client
  const socket = new WebSocket('wss://dummy-url'); // Placeholder since Netlify can't accept WebSocket on its own

  // When the target WebSocket connection is open, forward messages
  targetSocket.on('open', () => {
    // Forward messages from the client to the target WebSocket server
    socket.on('message', (message) => {
      targetSocket.send(message);
    });

    // Forward messages from the target WebSocket server back to the client
    targetSocket.on('message', (message) => {
      socket.send(message);
    });

    // Handle connection close for both sockets
    socket.on('close', () => targetSocket.close());
    targetSocket.on('close', () => socket.close());
  });

  // Return the response for the WebSocket upgrade
  return {
    statusCode: 101,
    statusText: 'Switching Protocols',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };
};
