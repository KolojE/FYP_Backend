import { Socket } from "socket.io";
import { sendMessageEventValidationMiddleware } from "../middleware/sokcetIOMiddleware";
import { IUser } from "../models/user";

type PendingMessage = {
    senderID: string,
    message: string
}

const pendingMessages = new Map<string, PendingMessage[]>();
const onlineUserIDs = new Map<string, string>();


export function socketConnceted(socket: Socket) {


    const io = socket.nsp
    const user: IUser = socket.data.user; //sender

    console.log("user " + user._id + " connected to socket.io")
    console.log(pendingMessages)
    const userID = user._id.toString()
    onlineUserIDs.set(userID, socket.id);

    console.log(onlineUserIDs)
    //Add user to onlineUserIDs if not already in
    socket.use((event, next) => {
        if (event[0] === "sendMessage")
            sendMessageEventValidationMiddleware(user, event, next)
        else next()
    });

    //Send pending messages to user
    socket.on("getPendingMessages", () => {
        if (pendingMessages.has(userID)) {
            console.log("get pending message from " + userID)

            const messages = pendingMessages.get(userID);
            messages?.forEach((message) => {
                console.log("send pending message to " + userID)
                io.to(userID).emit("receiveMessage", message.senderID, message.message)
            })
            pendingMessages.delete(userID)
        }
    })


    socket.on("sendMessage", (...args) => {
        const ack = args[args.length - 1];
        console.log(pendingMessages)

        const [receipientID, message] = args;
        const sender: IUser = socket.data.user;
        console.log("receipientID: " + receipientID)
        //Check if receipient is online
        if (io.sockets.has(onlineUserIDs.get(receipientID) ?? "")) {
            console.log("send message to " + receipientID)
            io.to(receipientID).emit("receiveMessage", sender._id, message)
            ack({
                status: "success",
                message: "Message Sent Successfully"
            })
            return;
        }

        //If receipient is not online, store the message in pendingMessages
        if (!pendingMessages.has(receipientID)) {
            pendingMessages.set(receipientID, [])
            ack({
                status: "success",
                message: "Not Online, Message Will Be Sent When Online"
            })
        }
        pendingMessages?.get(receipientID)?.push({ message: message, senderID: sender._id.toString() })

    });

    socket.on("disconnect", () => {
        onlineUserIDs.delete(userID)
        console.log(onlineUserIDs)
        console.log("user " + user._id + " disconnected from socket.io")
    })

    socket.on("error", (error) => {
        console.log(error)
    })



}