import { Socket } from "socket.io";
import { clientError, statusCode } from "../exception/errorHandler";
import { authenticationService } from "../services/authentication.services";
import { Event } from "socket.io";
import userModel, { IUser, role } from "../models/user";
export async function socketIOAuthenticationMiddleware(socket: Socket, next: Function) {
    try {

        const token = socket.handshake.auth.token.toString().split(" ")[1]; // get token, e.g. Bearer "token"
        console.log(token)
        if (!token) {
            throw new clientError({
                message: "Token is not provided !",
                status: statusCode.unauthorized,
            })
        }

        const user = await authenticationService.verifyToken(token);


        if (!user) {
            throw new clientError({
                message: "The token is not belong to any user!",
                status: statusCode.unauthorized,
            })
        }
        console.log(user._id + 'joined room')
        socket.join(user._id.toString())
        socket.data.user = user;

        next();

    } catch (err) {
    next(err)
    }

}

export async function sendMessageEventValidationMiddleware(user: IUser, event: Event, next: Function) {
    const eventName = event[0];
    const args = event[1];

    const receipientID: string = args;


    try {

        const receipientUser = await userModel.findById(receipientID)
        console.log(user)
        if (!receipientUser) {
            return
        }
        //Validate if sender have the right to interact with receipient
        if (!receipientUser.organization._id.equals(user.organization._id)) {
            console.log("Warning !: user " + user._id + "is trying to connect user" + receipientUser.id + " which they are not in the same organization")
            return;
        }

        if (user.role === role.complainant && receipientUser.role === role.complainant) {
            return;
        }

        next();

    }
    catch (err) {
        next(err)

    }



}
