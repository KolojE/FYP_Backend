import { Server} from "socket.io";
import { socketIOAuthenticationMiddleware } from "../middleware/sokcetIOMiddleware";
import { onConnectionController } from "../controller/socketIO.controller";

export function socketIORouter(io:Server)
{
    const clientIO = io.of("/chat");

    clientIO.use(socketIOAuthenticationMiddleware);
    clientIO.on("connection",onConnectionController);
}