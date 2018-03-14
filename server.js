const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 8080;
app.use(require("morgan")("dev"));

let games = [];

app.get("/api/validate/:gameID", (req, res) => {
  let found = false;
  const game = games.filter(game => game.id == req.params.gameID)[0];
  if (game) {
    if (game.players.length > 1) {
      res.status(403).send({ error: "full" });
    } else {
      res.status(200).send({ success: "game exists and has space" });
    }
  } else {
    res.status(404).send({ error: "not found" });
  }
});

generateID = a =>
  a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e2] + -1e2).replace(/[018]/g, generateID).toUpperCase();
// https://gist.github.com/jed/982883

app.get("/api/create", (req, res) => {
  games.push({
    id: generateID(),
    players: []
  });

  res.status(200).send({ newGameID: games[games.length - 1].id });
});

io.on("connection", socket => {
  console.log("User connected");

  socket.on("joinGame", (data, callback) => {
    const game = games.filter(game => game.id == data.gameID)[0];
    if (game) {
      if (game.players.length > 1) {
        console.error("Game is full, but was validated");
      } else {
        if (game.players.length == 1) {
          game.players.push({
            ready: false,
            heads: !game.players[0].heads,
            id: socket.id
          });
        } else {
          game.players.push({
            ready: false,
            heads: Math.random() > 0.5, // Maybe there will be the ability to choose side
            id: socket.id
          });
        }

        socket.join(game.id);
        console.log("User joined " + game.id);

        callback({
          ready: false,
          heads: game.players[game.players.length - 1].heads
        });

        if (game.players.length == 2) {
          // both are connected
          // Send enemy info to latest
          socket.emit("enemyInfo", {
            ready: game.players[0].ready,
            heads: game.players[0].heads
          });

          // Send latest info to enemy
          io.to(game.players[0].id).emit("enemyInfo", {
            ready: game.players[1].ready,
            heads: game.players[1].heads
          });
        }
      }
    } else {
      console.error("Game does not exist, but was validated");
    }
  });

  socket.on("ready", (data, callback) => {
    const game = games.filter(game => game.id == data.gameID)[0];
    if (game) {
      for (player of game.players) {
        if (player.id == socket.id) {
          player.ready = !player.ready;
          callback();
          console.log("User in " + game.id + " changed ready state")
        } else {
          io.to(player.id).emit("enemyReady", null);
          console.log("Enemy in " + game.id + " has been notified of ready state change")
        }
      }

      // Check if both are ready and then flip coin
    }
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log("Listening on port " + port);
});
