"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const main_router_1 = __importDefault(require("./router/main.router"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketIO_router_1 = require("./router/socketIO.router");
(0, dotenv_1.config)();
console.log("Starting Server...");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, { cors: {
        origin: "*",
    } });
(0, socketIO_router_1.socketIORouter)(io);
app.use(express_1.default.json());
app.use(main_router_1.default);
httpServer.listen(8080, () => {
    console.log("Listening on port:8080");
});
(0, db_1.ConnectDatabase)(() => {
    console.log("Connected to Database");
});
//# sourceMappingURL=index.js.map