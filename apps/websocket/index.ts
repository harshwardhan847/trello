import WebSocket, { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 3002 });

const ROOMS: Record<string, { id: string; socket: WebSocket }[]> = {};
server.on("connection", (socket) => {
  let joinedRoom: string | null = null;
  socket.on("message", (data) => {
    const parsedData = JSON.parse(data.toString());
    if (parsedData.type === "join") {
      const boardId = parsedData.boardId;
      joinedRoom = boardId;
      if (!ROOMS[boardId]) {
        ROOMS[boardId] = [];
      }
      const newUserId = Math.random().toString();

      for (let i = 0; i < ROOMS[boardId].length; i++) {
        const user = ROOMS[boardId][i];
        user?.socket.send(
          JSON.stringify({
            type: "join",
            userId: newUserId,
          }),
        );
      }

      ROOMS[boardId]?.push({ id: newUserId, socket: socket });

      socket.send(
        JSON.stringify({
          type: "initial_state",
          users: ROOMS[boardId]
            ?.filter((x) => x.id !== newUserId)
            ?.map((u) => ({ id: u.id })),
        }),
      );
    }
  });

  socket.on("close", () => {
    if (!joinedRoom) {
      return;
    }
    const users = ROOMS[joinedRoom];
    if (!users) return;
    const removeUser = users.find((u) => u.socket == socket);
    ROOMS[joinedRoom] = users.filter((x) => x.socket != socket);
    users.forEach(({ socket }) =>
      socket.send(JSON.stringify({ type: "leave", userId: removeUser?.id })),
    );
  });
});
