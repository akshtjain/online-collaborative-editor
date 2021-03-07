const app = require("express")();
const http = require("http").Server(app);
// const io = require("socket.io")(http);


const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", function(socket) {
  socket.on("new-operations", function(data) {
    io.emit("new-remote-operations", data);
  });
});

http.listen(4000, function() {
  console.log("listening on *:4000");
});