import * as  http from 'http';
import * as debug from 'debug';
import * as socketIO from 'socket.io';
import WebAPI from './webAPI';
import SCADAsim from './scadaSimulator';
import {Variable, VariableType} from './variable';

let log = debug('scada:server');
let variables = require('../data/variables');


// The port the express app will listen on
const port = normalizePort(process.env.PORT || 9000);
WebAPI.set('port', port);

const server = http.createServer(WebAPI);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

var sim = new SCADAsim(variables, { tickTime: process.env.TICK_TIME || 1000 });
sim.on('variableChange', onVariableChange);

var sio = socketIO();
sio.serveClient(false); // the server will serve the client js file
sio.attach(server);
sio.on('connection', function(socket) {
  log('User ' + socket.id + ' connected');
  if (!sim.running)
    sim.startSimulate();

  socket.on('varValUpdate', function(variable) {
    log('Variable ' + variable.name + ' change value to ' + variable.value)
    sim.updateVariable(variable.name, variable.value);
  });
});

function onVariableChange(changedVariables: Variable[]) {
  // log('Variables changed:', changedVariables);
  sio.emit('varValChanged', changedVariables);
}

function normalizePort(val: number | string): number | string | boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
