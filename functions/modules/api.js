const http = require('http');
const app = require('../../functions/core/route_api.js');
const fs = require('fs');
const { Logs } = require("../../functions/core/LogCore.js");
const Mod = 'API';
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

// Recupe config Agent
const DataModule = require('../../data/config.json');
console.log(DataModule);
const API_Port = DataModule.port;

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(API_Port ||  '6000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    switch (error.code) {
        case 'EACCES':
            Logs(Mod, 'fatal', 'Prévilège plus élevé demandé');
            process.exit(1);

        case 'EADDRINUSE':
            Logs(Mod, 'fatal', 'Le port est déjà utilisé');
            process.exit(1);

        default:
            throw error;
    }
};

const server = http.createServer(app);

// SERVEUR HTTP
server.on('error', errorHandler);
server.on('listening', () => {
    Logs(Mod, 'info', 'API ouvert sur le port:'+ port);
});
server.listen(port);