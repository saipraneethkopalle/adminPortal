const socket = require('socket.io');
const redis = require('socket.io-redis');
const redisdb = require('../constants/redis-db');


const Socketconnection = (function () {
  this.io = null;
  this.configure = function (server, type) {
    this.io = socket(server, {
      serveClient: true,
      cookie: false
    });
    this.io.adapter(redis({ host: '127.0.0.1', port: 6379 })); 
    if (type == 'master') {
      getET(this.io);
    }
  }
  return this;
})();

const addRooms = async (io) => {  
  const rooms = await io.of('/').adapter.allRooms();
  const room = Array.from(rooms);
  const oddsRoom = room.filter(dt => dt.startsWith('room-Event')).map(mt => mt.split('/')[2]);
  const oddsMRoom = room.filter(dt => dt.startsWith('room-MEvent')).map(mt => mt.split('/')[2]);
  const fancyRoom = room.filter(dt => dt.startsWith('room-Fancy')).map(mt => mt.split('/')[2]);
  const bmRoom = room.filter(dt => dt.startsWith('room-BookM')).map(mt => mt.split('/')[2]);
  await redisdb.SetRedis('ODDS_ROOMS', JSON.stringify(oddsRoom));
  await redisdb.SetRedis('ODDS_MUL_ROOMS', JSON.stringify(oddsMRoom)); 
  await redisdb.SetRedis('FANCY_ROOMS', JSON.stringify(fancyRoom));
  await redisdb.SetRedis('BM_ROOMS', JSON.stringify(bmRoom));
}

const getET = (io) => {
  setInterval(() => {
    addRooms(io);
  }, 500);
}

module.exports = Socketconnection;