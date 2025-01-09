export const initializeWebSocket = () => {
  const ws = new WebSocket("ws://your-websocket-server-url");

  ws.onopen = () => {
    console.log("WebSocket connection established");
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed. Reconnecting...");
    setTimeout(() => initializeWebSocket(), 5000); // Retry connection
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return ws;
};
