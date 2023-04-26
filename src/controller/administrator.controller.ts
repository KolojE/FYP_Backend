import { Request, Response, query } from "express";
import complaiantModel from "../models/complainant";
import { administratorService } from "../services/administrator.service";
import { validationService } from "../services/validation.service";
import { FormModel } from "../models/form";



export async function addFormController(req: Request, res: Response, next: Function) {
    try {
        const newForm = req.body;
        const user = req.user;

        await validationService.form_Validation(newForm);



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

        await validationService.form_Validation(updateForm);
        const updatedForm = await administratorService.updateForm(updateForm, req.user)
        res.status(200).json({
            message: "successfully updated form",
            data: updatedForm,
        }).send()
    } catch (err) {
        next(err);
    }
}

export async function deleteFormController(req: Request, res: Response, next: Function) {
    try {
        const formToDelete = req.query._id;
        const user = req.user

        const deletedForm = await FormModel.deleteOne({ _id: formToDelete }).where({ organization: user.organization })
        console.log(`Form ${formToDelete} is deleted. `);

        res.status(200).json({
            message: `sucessfully deleted form ${formToDelete}`,
            data: deletedForm
        })

    } catch (err) {
        next(err);
    }
}



export async function viewMembersController(req: Request, res: Response, next: Function) {
    try {
        const members = await complaiantModel.aggregate([
            {
                $lookup: {
                    from: "users", localField: "user._id", foreignField: "_id",
                    as: "user"
                }
            }
            ,
            {
                $lookup: {
                    from: "organizations", localField: "user.organization._id", foreignField: "_id",
                    as: "organization"
                }
            }
            ,
            {
                $match: {
                    'user.organization': req.user.organization
                }
            }
            ,
            {
                $unwind: "$user"

            },
            {
                $unwind: "$organization"
            },
            {
                $project: {
                    "user.password": 0,
                    "user.organization":0,
                }
            }
        ]);

        console.log(members)
        res.status(200).json({
            message: "successfully get all members info",
            members: members
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
