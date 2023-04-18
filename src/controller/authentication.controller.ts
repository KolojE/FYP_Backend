import { Request, Response } from "express";
import { clientError, statusCode } from "../exception/errorHandler";
import { authenticationService } from "../services/authentication.services";

export async function authentication(req: Request, res: Response, next: Function) {

    try {
    
        const user = await authenticationService.authenticateUser(req.body);
        console.log(user)
        if (user === null)
            throw new clientError({
                message: "Failed to authenticate user, no user found.",
                status: statusCode.notfound,
            }) 

        const token = await authenticationService.generateJWT(user);
        res.set({
            "Authorization": `Baerer ${token}`
        })

        const userOmitPassword={...user.toObject(),password:undefined}
         

        console.log("user ommited password"+userOmitPassword)

        res.status(200).json({
            loginUser:userOmitPassword,
            message: "Sucessfully authenticatd token returned in the header",
        })

    } catch (err) {
        next(err)
    }

}

