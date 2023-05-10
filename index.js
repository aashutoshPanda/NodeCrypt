import path from "path";
import express from "express";
import { EVENTS } from "./src/contants.js";
import { handleDisconnect, handleJoinRoom, handleSendMessage } from "./src/controllers/chatEvents.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

io.on(EVENTS.CONNECT, (socket) => {
  console.log("a user connected");
  socket.on(EVENTS.JOIN_ROOM, ({ username, room }) => handleJoinRoom({ socket, io, username, room }));
  socket.on(EVENTS.SEND_MESSAGE, (msg) => handleSendMessage({ io, socket, msg }));
  socket.on(EVENTS.DISCONNECT, () => handleDisconnect({ io, socket }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
