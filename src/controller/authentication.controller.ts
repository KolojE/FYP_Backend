import { Request, Response } from "express";
import { clientError } from "../exception/errorHandler";
import { authenticationService } from "../services/authentication.services";


export async function authentication(req: Request, res: Response, next: Function) {

    try {
        const user = await authenticationService.authenticateUser(req.body);
        if (user === null)
            throw {
                message: "Failed to authenticate user, no user found",
                status: 404,
            } as clientError

        const token = await authenticationService.generateJWT(user);

    } catch
    {

    }

}

