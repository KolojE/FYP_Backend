import { Request, Response } from "express";
import OrganizationModel from "../models/organization";
import { OrganizationService } from "../services/organization.service";


export async function register_Organization(req: Request, res: Response) {
    console.log(req.body)
    try {
        const result = await OrganizationService.create_New_Organization(req.body)
        console.log("New Organization is inserted in the database");
        res.status(200).json({
            message: "successfully inserted organization",
            isCompleted: true,
            resolved: result,
        }).send();
    } catch (error) {
        res.status(500).json({
            message: "failed to insert organization",
            isCompleted: false,
            error: error,
        });

    }

}

export async function get_All_Organizations(req: Request, res: Response) {
    console.log("get all organization")
    try {
        const result = OrganizationService.get_All_Organizations()
        res.status(200).json({
            message: "Sucessfully returned all organization",
            isCompleted: true,
            resolved: result
        }).send()

    }
    catch (error) {
        res.status(500).json({
            message: "Sucessfully returned all organization",
            isCompleted: true,
            errir: error
        }).send()

    }
}

export function create_Collection(req: Request, res: Response) {
    OrganizationModel.createCollection().then((resolved) => {
        res.status(200).json({
            message: "Organization Collection Is Created, This doesnt have to be done manually since moongose will handle the creation.",
            resolved: resolved
        }).send();
    }, (rejected) => {
        res.status(500).json({
            message: "Creation failed, Please see the error for details",
            erro: rejected
        }).send(
        );

    })
}
