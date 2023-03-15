import { Request, Response } from "express";
import { complainantService } from "../services/complainant.services";

export async function register_Complainant(req: Request, res: Response, next: Function) {

    try {
        const result = await complainantService.register_Complainant(req.body);
        res.status(200).json({
            message: "Registration Successful !",
            resolved: result,
        }).send()
    }
    catch (err) {
        next(err)
    }

}