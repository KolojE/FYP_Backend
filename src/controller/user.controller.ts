import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import userModel from "../models/user"; import { clientError, statusCode } from "../exception/errorHandler"; import OrganizationModel from "../models/organization";
import { IForm, FormModel } from "../models/form";




export async function getUserInfoController(req: Request, res: Response, next: Function) {

    try {

        const _id: ObjectId = new ObjectId(req.user._id);
        const user = await userModel.findById(_id);
        if (!user) {
            throw new clientError(
                {
                    message: `No User Found with _id ${_id}`,
                    status: statusCode.notfound,
                })
        }
        const organization = await OrganizationModel.findById(user.organization._id)

        if (!organization) {
            throw new clientError(
                {
                    message: `No organization Found with _id ${user.organization._id}`,
                    status: statusCode.notfound,
                })
        }
        console.log(organization);

        res.status(200).json({
            message: "User",
            loggedInUser: { ...user.toObject(), password: undefined },
            organization: organization,
        })


    }
    catch (err) {
        next(err);
    }


}
export async function getAllForms(req: Request, res: Response, next: Function) {
    try {
        const forms = await FormModel.find<IForm>({
            organization: req.user.organization
        });

        res.status(200).send({
            message: "Forms Returned Successfully",
            forms: forms
        });
    } catch (err) {
        next(err)
    }
}

export async function getForm(req: Request, res: Response, next: Function) {

    
    try {
        const formID = req.query._id;
        console.log(formID)
        if(!formID)
        {
            throw new clientError({
                message:"formID not provided!",
                status:statusCode.badRequest,
                data:`{
                    form:{
                        _id:$_id
                    }
                }`
            })
        }
        const form = await FormModel.findById<IForm>(formID
        )

        if(!form)
        {
            throw new clientError({
                message:`Not Form Is Found With ID ${formID}`,
                status:statusCode.notfound,
            })
        }


        res.status(200).send({
            form:form,
            message:`Form ${formID} found`
        })
    } catch (err) {
        next(err)
    }
}
