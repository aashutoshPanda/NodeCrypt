import { getActiveUser, exitRoom, newUser, getIndividualRoomUsers } from "../states/users.js";
import { EVENTS } from "../contants.js";
import { sendMessageData } from "../helpers/message.js";

export const handleJoinRoom = ({ username, room, socket, io }) => {
  const user = newUser(socket.id, username, room);

  socket.join(user.room);

  // General welcome
  socket.emit(EVENTS.SEND_MESSAGE, sendMessageData("NodeCrypt", "Messages are limited to this room! "));

  // Broadcast everytime users connects
  socket.broadcast
    .to(user.room)
    .emit(EVENTS.SEND_MESSAGE, sendMessageData("NodeCrypt", `${user.username} has joined the room`));

  // Current active users and room name
  io.to(user.room).emit(EVENTS.USER_DATA_CURRENT_ROOM, {
    room: user.room,
    users: getIndividualRoomUsers(user.room),
  });
};

export const handleSendMessage = ({ socket, io, msg }) => {
  const user = getActiveUser(socket.id);
  io.to(user.room).emit(EVENTS.SEND_MESSAGE, sendMessageData(user.username, msg));
};

export const handleDisconnect = ({ socket, io }) => {
  const user = exitRoom(socket.id);
  if (user) {
    io.to(user.room).emit(EVENTS.SEND_MESSAGE, sendMessageData("NodeCrypt", `${user.username} has left the room`));
    // Current active users and room name
    io.to(user.room).emit(EVENTS.USER_DATA_CURRENT_ROOM, {
      room: user.room,
      users: getIndividualRoomUsers(user.room),
    });
  }
};
