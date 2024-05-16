import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const Port = process.env.PORT || 4003
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
      origin: "",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

io.on("connection", (socket) => {
    console.log("user connected", socket.id)

    socket.on("message", ({ room, message }) => {
        console.log({ room, message });
        socket.to(room).emit("recieve-message", message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`user join : ${room}`)
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

server.listen(Port, () => {
    console.log(`listening port is ${Port}`)
})
