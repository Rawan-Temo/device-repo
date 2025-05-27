// Utility function to send a message through a WebSocket
export function sendWebSocketMessage(socket, data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn("WebSocket is not open. Message not sent.", data);
  }
}
