const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);


const port = process.env.PORT || 8080;
app.use(require("morgan")("dev"));
app.use(require("body-parser").json());

let games = [];

app.post("/api/join", (req, res) => {
  let found = false;
  console.log(req.bod)
  for (game of games) {
    if (game.id == req.body.gameID) {
      found = true;
      if (game.players.length > 1) {
        console.log("full");
        res.status(403).send({ error: "full" });
      } else {
        if (game.players.length == 1) {
          game.players.push({
            ready: false,
            heads: !game.players[0].heads,
            id: req.body.playerID
          });
        } else {
          game.players.push({
            ready: false,
            heads: true,
            id: req.body.playerID
          });
        }

        res.status(200).send({ id: game.players[game.players.length - 1].id });
      }
    }
  }

  if (!found) {
    console.log("not found");
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

  res.status(200).send({ gameID: games[games.length - 1].id });
});

io.on("connection", socket => {
  console.log("A user has connected");

  socket.on("joinGame", (data, callback) => {
    const game = games.filter(game => game.id == data.gameID)[0];
    console.log(game)
    if(game) {
      const player = game.players.filter(player => player.id == socket.id)[0];
      console.log(player)
      if(player) {
        conslone.log("User is joining game " + game.id);
        socket.join(game.id);
        callback({
          ready: player.ready,
          heads: player.heads
        });
      }
    }
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log("Listening on port " + port);
});
