import { Request, Response } from "express";
import { clientError, statusCode } from "../exception/errorHandler";
import { authenticationService } from "../services/authentication.services";
import userModel, { role } from "../models/user";
import { validationService } from "../services/validation.service";

export async function authenticationController(req: Request, res: Response, next: Function) {

    try {
        const user = await authenticationService.authenticateUser(req.body);
        if (user == null)
            throw new clientError({
                message: "Failed to authenticate user, no user found.",
                status: statusCode.notfound,
            })

        if (user.role === role.complainant) {
         await validationService.is_Complainant_Active(user);
        }

        const token = await authenticationService.generateJWT(user);
        res.set({
            "Authorization": `Baerer ${token}`
        })

        const userOmitPassword = { ...user, password: undefined }



        res.status(200).json({
            loginUser: userOmitPassword,
            token: token?token:undefined,
            message: "Sucessfully authenticatd token returned in the header",
        })

    } catch (err) {
        console.log(err)
        next(err)
    }

}

export async function tokenAuthenticationController(req: Request, res: Response, next: Function) {


    try {
        const authorization = req.headers.authorization?.split(' ');
        if (!authorization)
            throw new clientError(
                {
                    message: "Please Porvid token",
                    status: statusCode.unauthorized,

                }
            )
        const type = authorization[0]

        if (type != "Baerer")
            throw new clientError(
                {
                    message: "authorization method should be Bearer",
                    status: statusCode.badRequest,
                }
            )
        const token = authorization[1]
        const decodedToken = await authenticationService.verifyToken(token)
        const loginUser = await userModel.findById(
            decodedToken._id).lean()
        if (!loginUser) {
            throw new clientError(
                {
                    message: "User not found",
                    status: statusCode.notfound,
                }
            )
        }

        if (loginUser.role === role.complainant) {
            await validationService.is_Complainant_Active(loginUser);
        }

        const userOmitPassword = { ...loginUser, password: undefined }
        res.status(200).send(
            {
                loginUser: userOmitPassword,
                message: "Login Sucessfully",
            }
        )

    }
    catch (err) {
        next(err)
    }
}

