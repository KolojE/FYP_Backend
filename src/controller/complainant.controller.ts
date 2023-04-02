import { Request, Response } from "express";
import { clientError } from "../exception/errorHandler";
import { reportIncidentService } from "../services/reportIncident.service";


export async function reportIncidentController(req: Request, res: Response, next: Function) {

    try {

        await reportIncidentService.reportIncident(req.body, req.user);


        res.status(200).json(
            {
                message: "Vlidate sucess, report being saved"
            },
        ).send()
    } catch (err) {
        next(err)
    }

}