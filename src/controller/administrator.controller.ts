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