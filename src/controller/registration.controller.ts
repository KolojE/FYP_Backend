import { Request, Response } from "express";
import { registrationService } from "../services/registration.service";

export async function registerComplainantController(req: Request, res: Response, next: Function) {

    try {
        const result = await registrationService.register_Complainant(req.body);
        res.status(200).json({
            message: "Registration Successful !",
            resolved: result,
        }).send()
    }
    catch (err) {
        next(err)
    }

}