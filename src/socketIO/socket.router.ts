import { Namespace, Server, Socket } from "socket.io";
import { onSendMessage } from "./socket.controller";
import { sendMessageEventValidationMiddleware, socketIOAuthenticationMiddleware } from "../middleware/sokcetIOMiddleware";
import { IUser } from "../models/user";


export function socketRouter(socket: Socket) {

    const IO = socket.nsp
    const user: IUser = socket.data.user;

    socket.use((event, next) => {
        sendMessageEventValidationMiddleware(user, event, next)
    });


    socket.on("sendMessage", (...args) => {
        console.log("asd")
        onSendMessage(IO, socket, args)
    });

    socket.on("error",(error)=>{
    console.log(error)
    })



}