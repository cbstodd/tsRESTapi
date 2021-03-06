// import express from 'express';
import express = require('express');
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors = require('cors');
import { CommonRoutesConfig } from './routes/common.routes.config';
import { UsersRoutes } from './routes/users.routes.config';
import debug from 'debug';
import { Logform } from 'winston';



const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: number = 1111;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');


// Middleware API:
app.use(express.json());
app.use(cors());

// For debugging. Shows when Server requests are made.
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true })
    ),
};

// Added because new thing about not allowing "console.log"...
if (!process.env.DEBUG) {
    loggerOptions.meta = false;
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// Users Routes:
routes.push(new UsersRoutes(app));

const serverMsg: string = `Server running at http://localhost:${port}`;

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(serverMsg)
});

server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });

    console.log(serverMsg);
});
