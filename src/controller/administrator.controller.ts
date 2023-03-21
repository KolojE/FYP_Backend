import { Request, Response } from "express";
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
            data: updateForm,
        })
    } catch (err) {
        next(err);
    }
}