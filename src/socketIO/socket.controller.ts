import { Namespace, Server, Socket } from "socket.io";


type message = {

    message:String;
}


export function onSendMessage(io:Server|Namespace,socket:Socket,args:any)
{
    const [userID,message]:[string,message]= args;
    io.to(userID).emit("receiveMessage",message.message);
    
}