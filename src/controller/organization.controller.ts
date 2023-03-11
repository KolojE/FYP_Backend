import express, { Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
import OrganizationModel from "../models/organization";


export async function insert_Organization(req: Request, res: Response) {
    const newOrganization = req.body;


    const newOrganization_ = new OrganizationModel({
        organizationID: newOrganization.organizationID,
        organizationName: newOrganization.organizationName,
        address: newOrganization.address,
        contactNo: newOrganization.contactNo,
        creationDate: newOrganization.createDate,
    });

    newOrganization_.save().then(
        (resolved) => {
            console.log("New Organization is inserted in the database");
            res.status(200).json({
                message: "successfully inserted organization",
                isCompleted: true,
                Resolved: resolved,
            });
        },
        (rejected) => {
            res.status(500).json({
                message: "failed to insert organization",
                isCompleted: false,
                error: rejected,
            });
        }
    );
}
export function get_All_Organization(req: Request, res: Response) {
    console.log("get all organization")
    const organization = OrganizationModel.find()
    res.send(200)
}

export function create_Collection(req: Request, res: Response) {
    console.log("creating collection");
    OrganizationModel.createCollection().then((resolved) => {
        console.log(resolved.collectionName);
        console.log("Collection Organization is Created")
        res.sendStatus(200);
    }, (rejected) => {
        console.log("Creation of Collectiion Organization Being Rejected")
    });

}

