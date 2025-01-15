const WebSocket = require('ws');

exports.handler = async (event, context) => {
  const targetSocket = new WebSocket('wss://filaments.hrfee.pw/socket');
  
  if (event.headers['Upgrade'] === 'websocket') {
    // Accept the WebSocket connection from the client
    const socket = new WebSocket(event.body);

    socket.on('message', (message) => {
      targetSocket.send(message);
    });

    targetSocket.on('message', (message) => {
      socket.send(message);
    });

    socket.on('close', () => targetSocket.close());
    targetSocket.on('close', () => socket.close());
  }

  return {
    statusCode: 200,
    body: 'WebSocket Proxy Established',
  };
};
