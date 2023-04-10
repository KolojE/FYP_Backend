import { Socket } from "socket.io";
import { clientError, statusCode } from "../exception/errorHandler";
import { authenticationService } from "../services/authentication.services";


export async function socketIOAuthenticationMiddleware(socket:Socket,next:Function)
{
    try {

        const token = socket.handshake.headers["authorization"]?.split(' ')[1]; // get token, e.g. Bearer "token"
        console.log(token)
        if (!token) {
            throw {
                message: "Token is not provided !",
                status: statusCode.unauthorize,
            } as clientError
        }

        const user = await authenticationService.verifyToken(token);

        
        if (!user) {
            throw {
                message: "The token is not belong to any user!",
                status: statusCode.unauthorize,
            } as clientError
        }

        socket.data.user = user ;
        next();


    } catch (err) {
        next(err)
    }


}
