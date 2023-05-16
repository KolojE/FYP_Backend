import { Namespace, Server, Socket } from "socket.io";
import { IUser } from "../models/user";


type message = {

    message:String;
}


export function onSendMessage(io:Server|Namespace,socket:Socket,args:any)
{
    const [userID,message]:[string,message]= args;
    const sender:IUser = socket.data.user;
    console.log(sender)
    io.to(userID).emit("receiveMessage",sender._id,message)
    
}