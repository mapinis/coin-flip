const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 8080;
app.use(require('morgan')('dev'));

server.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port)
})
