import { Request, Response } from "express";
import { clientError, statusCode } from "../exception/errorHandler";
import { role } from "../models/user";
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
                message: "The token is not belong to any user!",
                status: statusCode.unauthorize,
            } as clientError
        }

        req.user = user;
        next();

    } catch (err) {
        next(err)
    }

}

export async function adminVerificationMiddleware(req: Request, res: Response, next: Function) {
    try {
        if (req.user.role === role.admin) {
            next()
            return;
        }
        console.log("authenticating admin")
        throw {
            message: "You do not have sufficient permission to make the request",
            status: statusCode.unauthorize,
        } as clientError
    } catch (err) {
        next(err);
    }


}

export async function complainantVerificationMiddleware(req: Request, res: Response, next: Function) {
    try {
        if (req.user.role === role.complainant) {
            next()
            return;
        }
        console.log("asd")
        throw {
            message: "You do not have sufficient permission to make the request",
            status: statusCode.unauthorize,
        } as clientError

    } catch (err) {
        next(err);
    }
}

