import { Request, Response } from "express";
import OrganizationModel from "../models/organization";
import { OrganizationService } from "../services/organization.service";


export async function register_Organization(req: Request, res: Response, next: Function) {
    console.log(req.body)
    try {
        console.log("Creating new organization");
        const newOrganization = await OrganizationService.create_New_Organization(req.body)
        console.log("Creating Root Admin")
        const newRootAdmin = await OrganizationService.create_Root_Admin(newOrganization, req.body);
        res.status(200).json({
            message: "successfully inserted organization and root admin is created",
            isCompleted: true,
            resolve: {
                organization: {
                    ID: newOrganization.ID,
                    Name: newOrganization.name,
                },
                rootAdmin: {
                    ID: newRootAdmin.ID,
                    email: newRootAdmin.email,
                }
            },

        }).send();


    } catch (err) {
        next(err);
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
