import { ConnectDatabase } from "./config/db";
import express, { Express } from "express";
import { config } from "dotenv";
import mainRouter from "./router/main.router";
import  HttpServer  from "http";
import socketIO from "./socketIO/socket.io";


config();


console.log("Starting Server...")
const app: Express = express();
const httpServer:HttpServer.Server = HttpServer.createServer(app);

const socketio = socketIO(httpServer);

app.use(express.json())
app.use(mainRouter);

httpServer.listen(8080, () => {
    console.log("Listening on port:8080")
})


ConnectDatabase(() => {
    console.log("Connected to Database");
});

