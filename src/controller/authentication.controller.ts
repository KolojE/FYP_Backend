import { Request, Response } from "express";
import { clientError, statusCode } from "../exception/errorHandler";
import { authenticationService } from "../services/authentication.services";


export async function authentication(req: Request, res: Response, next: Function) {

    try {
        const user = await authenticationService.authenticateUser(req.body);
        console.log(user)
        if (user === null)
            throw {
                message: "Failed to authenticate user, no user found.",
                status: statusCode.notfound,
            } as clientError

        const token = await authenticationService.generateJWT(user);
        res.set({
            "Authorization": `Baerer ${token}`
        })

        res.status(200).json({
            UserRole: user.role,
            message: "Sucessfully authenticatd token returned in the header",
        })

    } catch (err) {
        next(err)
    }

}

