import { Socket } from "socket.io";
import { IUser } from "../models/user";


export async function onConnectionController(clientSocket:Socket)
{
    const user: IUser = clientSocket.data.user;
    console.log("user "+user._id + " connected");
}