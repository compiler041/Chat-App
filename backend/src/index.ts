import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({
  port: 8080,
  host: "0.0.0.0",
});

/* =======================
   Types
======================= */

interface User {
  socket: WebSocket;
  room: string;
}

interface JoinMessage {
  type: "join";
  payload: {
    roomId: string;
  };
}

interface ChatMessage {
  type: "chat";
  payload: {
    message: string;
  };
}

type IncomingMessage = JoinMessage | ChatMessage;

/* =======================
   State
======================= */

const users: User[] = [];

/* =======================
   Helpers
======================= */

function safeParse(data: WebSocket.RawData): IncomingMessage[] | null {
  try {
    const parsed = JSON.parse(data.toString());
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    console.error("Invalid JSON:", err);
    return null;
  }
}

function removeUser(socket: WebSocket) {
  const index = users.findIndex((u) => u.socket === socket);
  if (index !== -1) users.splice(index, 1);
}

/* =======================
   WebSocket Logic
======================= */

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (data) => {
    const messages = safeParse(data);
    if (!messages) return;

    for (const msg of messages) {
      switch (msg.type) {
        case "join": {
          console.log(`User joined room: ${msg.payload.roomId}`);

          users.push({
            socket,
            room: msg.payload.roomId,
          });
          break;
        }

        case "chat": {
          const sender = users.find((u) => u.socket === socket);
          if (!sender) return;

          for (const user of users) {
            if (user.room === sender.room) {
              user.socket.send(msg.payload.message);
            }
          }
          break;
        }

        default:
          console.warn("Unknown message type:", msg);
      }
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
    removeUser(socket);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
    removeUser(socket);
  });
});

console.log("WebSocket server running on ws://localhost:8080");
