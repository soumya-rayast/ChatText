const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors")
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
})

io.on("connection", (socket) => {
    console.log(`User connected : ${socket.id}`)
    socket.on("send-message", (message) => {
        // showing message
        console.log(message)
        io.emit("received-message",message)
    })
    socket.on("disconnect", () => {
        console.log("User disconnected")
    })
    socket.on('typing',(data)=>{
        socket.broadcast.emit("typing",data)
    })
    socket.on("stop-typing",()=>{
        socket.broadcast.emit("stop-typing")
    })
})
const port = 5000;
server.listen(port, () => {
    console.log(`server running at port ${port}`)
})
