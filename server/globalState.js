export let globalState = {
  rooms: {},
};

function createRoom(roomId) {
  globalState.rooms[roomId] = {
    flow: "lobby",
    players: [],
    playerConnections: {},
  };
}

export function addUserToRoom(user, roomId) {
  // Create room if it doesn't exist
  if (!globalState.rooms[roomId]) createRoom(roomId);

  // Add user if not already in room; increment connection
  if (!globalState.rooms[roomId].playerConnections[user.id]) {
    globalState.rooms[roomId].players.push(user);
    globalState.rooms[roomId].playerConnections[user.id] = 1;
  } else {
    globalState.rooms[roomId].playerConnections[user.id] += 1;
  }
}

export function removeUserFromRoom(userId, roomId) {
  // Decrement connection if user connected
  if (globalState.rooms[roomId].playerConnections[userId]) {
    globalState.rooms[roomId].playerConnections[userId] -= 1;
  }

  // Remove user from room if no more connections
  if (globalState.rooms[roomId].playerConnections[userId] < 1) {
    globalState.rooms[roomId].players = globalState.rooms[
      roomId
    ].players.filter((p) => p.id !== userId);
  }

  // Delete room if no more players
  if (globalState.rooms[roomId].players.length === 0) {
    delete globalState.rooms[roomId];
  }
}
