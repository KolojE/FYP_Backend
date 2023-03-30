import { Request, Response } from "express";
import complaiantModel from "../models/complainant";
import { administratorService } from "../services/administrator.service";



export async function addFormController(req: Request, res: Response, next: Function) {
    try {
        const newForm = req.body;
        const user = req.user;
        const form = await administratorService.addNewForm(newForm, user);
        res.status(200).json({
            message: "successfully added new form",
            data: form,
        })

    } catch (err) {
        next(err);
    }


}

export async function updateFormController(req: Request, res: Response, next: Function) {
    try {
        const updateForm = req.body;
        const updatedForm = await administratorService.updateForm(updateForm)
        res.status(200).json({
            message: "successfully updated form",
            data: updatedForm,
        }).send()
    } catch (err) {
        next(err);
    }
}

export async function viewMembersController(req: Request, res: Response, next: Function) {
    try {
        const members = await complaiantModel.aggregate([{
            $lookup: {
                from: "users", localField: "User._id", foreignField: "_id",
                as: "User"
            }
        }]);
        res.status(200).json({
            message: "successfully get all members info",
            data: members
        })
    }
    catch (err) {
        next(err)
    }

}

export async function updateMembersController(req: Request, res: Response, next: Function) {

    try {
        const member = req.body;
        const updatedMember = await administratorService.updateMember(member);
        res.status(200).json({
            message: "successfully updated member",
            data: updatedMember,
        }).send()
    } catch (err) {
        next(err)
    }
}
