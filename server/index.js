const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
});
const cors = require("cors")
const port = 5000;
const MAX_LENGTH = 4000000000;
const CHANNELS = ["Game A", "Game B", "Arts", "Movie", "Meditation"];
const DRAWING_OPS = []
app.use(cors());

const REGISTERED_PINS = ["ADMIN1", "USER12", "GUEST1"];

const authenticate = (pin, callback) => {
  let auth = {
    success: false,
    isAdmin: false
  };
  if (REGISTERED_PINS.includes(pin)) {
    auth.success = true;
    if (pin == "ADMIN1") {
      auth.isAdmin = true;
    }
  }
  callback(auth);
};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on('pincode', ({pin, username}) => {
    console.log("Authenticating")
    authenticate(pin, (status) => {
      socket.emit('pincode', {...status, username: username});
    });
  });
  
  socket.on('join-channel', (channelId) => {
    socket.join(channelId);
    socket.emit('new-channel', null);
  });

  socket.on("message", ({channelId, username, msg}) => {
    socket.broadcast.to(channelId).emit("message", {username, msg});
  });

  socket.on("draw", (op) => {
    if (DRAWING_OPS.length > MAX_LENGTH) {
      DRAWING_OPS = [];
    }
    DRAWING_OPS.push(op);
    socket.broadcast.emit("draw", [op]);
  })

  socket.on("drawinit", () => {
    socket.emit("draw", DRAWING_OPS);
  })

  socket.on("movie", (data) => {
    socket.broadcast.emit("movie", data);
  })
});

app.get("/", (req, res, next) => {
  res.send("Hello world")
});

app.get("/test", (req, res, next) => {
  res.json({
    message: "good bye world"
  });
})

http.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}!`));