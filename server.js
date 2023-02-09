const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require('compression');
const cluster = require("cluster");
const router = require("./routes/routes");
const customerRouter = require("./routes/customerApis");
const auth = require("./constants/auth");
const login = require("./routes/beforeAuth")
const redisdb = require("./constants/redis-db");
// const bd = require("./autoUpdate/backgroundService");
const db = require("./constants/db");
const request = require("request");
const Socketconnection = require('./constants/socket');
const promBundle = require("express-prom-bundle");
const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
// const generateAccessToken = require("./constants/generateToken");
require('dotenv').config()

const app = express();

app.use(metricsMiddleware);
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())
// app.use(helmet());
app.use(cors());
app.use("/api/v1", auth);
app.use("/api/v1", router);
app.use("/api/v1-custom", customerRouter);
app.use("/api/beforelogin", login);

const http = require('http').Server(app);
const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  };
const totalCPUs = require("os").cpus().length;
 
if (cluster.isMaster) {
  //console.log(`Number of CPUs is ${totalCPUs}`);
 // console.log(`Master ${process.pid} is running`);
  Socketconnection.configure(http, 'master');
  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
 
  cluster.on("exit", (worker, code, signal) => {
   // console.log(`worker ${worker.process.pid} died`);
   // console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
    const port = 3000;
    app.set("port", port);
Socketconnection.configure(http, 'worker');
Socketconnection.io.on("connection", async (socket) => {
//    console.log("connected to admin socket");
    await redisdb.ZincrRedis('connection', 1, 'client', function (err, success) {
        //console.log(err, success);
      });
  
     socket.on('stats', function (data) {
        socket.join("room-stats");
      });
  
     await redisdb.Zrange('connection', 0, -1, "withscores", function (err, success) {
        //console.log(success, 'add');
        SocketSingleton.io.to('room-stats').emit('stats', { numClients: success[1] || 0 });
      });  

    socket.on('Event/Auto', function (data) {
        
        socket.join("room-Event/Auto/" + data);
    });

    socket.on('MEvent/Auto', function (data) {
        socket.join("room-MEvent/Auto/" + data);
    });
    socket.on('Fancy/Auto', function (data) {
    
        socket.join("room-Fancy/Auto/" + data);
    });

    socket.on('BookM/Auto', function (data) {
        socket.join("room-BookM/Auto/" + data);
    });
    socket.on('destroy_room', function () {
        var rooms = io.sockets.adapter.sids[socket.id];
        for (var room in rooms) {
            socket.leave(room);
        }
    });
    socket.on('disconnect', () => {
        //console.log(`Socket ${socket.id} disconnected.`);
        delete io.sockets.adapter.rooms[socket.id];
        redisdb.ZincrRedis('connection', -1, 'client', function (err, success) {
          //console.log(err, success);
        });
  
        redisdb.Zrange('connection', 0, -1, "withscores", function (err, success) {
          //console.log(success, 'remove');
          SocketSingleton.io.to('room-stats').emit('stats', { numClients: success[1] || 0 });
        });
      });
});
//console.log(`Worker ${process.pid} started`);
 
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
 
  app.get("/api/:n", function (req, res) {
    let n = parseInt(req.params.n);
    let count = 0;
 
    if (n > 5000000000) n = 5000000000;
 
    for (let i = 0; i <= n; i++) {
      count += i;
    }
 
    res.send(`Final count is ${count}`);
  });
  http.listen(port, function () {
    console.log('Server Started', port);
});
}
