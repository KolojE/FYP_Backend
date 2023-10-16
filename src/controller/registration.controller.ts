import { Request, Response } from "express";
import { registrationService } from "../services/registration.service";
import { authenticationService } from "../services/authentication.services";
import OrganizationModel from "../models/organization";

export async function registerComplainantController(req: Request, res: Response, next: Function) {
    try {
        const result = await registrationService.register_Complainant(req.body);
        const Organization = await OrganizationModel.findById(result.organization._id)

        if (Organization?.system.autoActiveNewUser) {
            const token = await authenticationService.generateJWT(result);

            res.set({
                "Authorization": `Baerer ${token}`
            })
        }

        res.status(200).json({
            message: "Registration Successful !",
            user: result,
        }).send()
    }
    catch (err) {
        next(err)
    }

}