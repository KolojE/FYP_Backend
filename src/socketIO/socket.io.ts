import { Server } from "socket.io";
import httpServer from "http";
import { socketConnceted } from "./socket.router";
import { socketIOAuthenticationMiddleware } from "../middleware/sokcetIOMiddleware";




function socketIO(httpServer: httpServer.Server) {


    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        }
    })


    io.on("connection", socketConnceted)
    io.use(socketIOAuthenticationMiddleware);

}



export default socketIO;
