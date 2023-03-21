import { Request, Response } from "express";
import { clientError, statusCode } from "../exception/errorHandler";
import { authenticationService } from "../services/authentication.services";


export async function authenticationMiddleware(req: Request, res: Response, next: Function) {
    try {

        const token = req.headers["authorization"]?.split(' ')[1]; // get token, e.g. Bearer "token"

        if (!token) {
            throw {
                message: "Token is not provided !",
                status: statusCode.unauthorize,
            } as clientError
        }

        const user = await authenticationService.verifyToken(token);
        if (!user) {
            throw {
                message: "Token is not provided !",
                status: statusCode.unauthorize,
            } as clientError
        }

        req.user = user;
        next();

    } catch (err) {
        next(err)
    }


}