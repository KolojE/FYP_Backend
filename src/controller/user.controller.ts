import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import userModel from "../models/user"; import { clientError, statusCode } from "../exception/errorHandler"; import OrganizationModel from "../models/organization";
import { IForm, FormModel } from "../models/form";
import { readFile } from "fs";
import { userService } from "../services/user.service";




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
        if (!formID) {
            throw new clientError({
                message: "formID not provided!",
                status: statusCode.badRequest,
                data: `{
                    form:{
                        _id:$_id
                    }
                }`
            })
        }
        const form = await FormModel.findById<IForm>(formID
        )

        if (!form) {
            throw new clientError({
                message: `Not Form Is Found With ID ${formID}`,
                status: statusCode.notfound,
            })
        }


        res.status(200).send({
            form: form,
            message: `Form ${formID} found`
        })
    } catch (err) {
        next(err)
    }
}

export async function uploadProfilePicture(req: Request, res: Response, next: Function) {
    try {
        const file = req.file;
        console.log(req.file)
        if (!file) {
            throw new clientError({
                message: "No File Uploaded",
                status: statusCode.badRequest,
            })
        }
        const user = await userModel.findByIdAndUpdate(req.user._id).set({
            profilePicture: file.path
        });

        if (!user) {
            throw new clientError({
                message: `No User Found with _id ${req.user._id}`,
                status: statusCode.notfound,
            })
        }
        res.status(200).json({
            message: "Profile Picture Uploaded Successfully",
            user: user
        })

    } catch (err) {
        next(err)
    }
}

export async function getProfilePicture(req: Request, res: Response, next: Function) {
    try {

        const user = await userModel.findById(req.query._id);
        if (!user) {
            throw new clientError({
                message: `No User Found with _id ${req.query._id}`,
                status: statusCode.notfound,
            })
        }

        if (user.organization._id.toString() != req.user.organization._id.toString()) {
            {
                throw new clientError({
                    message: `You are not authorized to access this resource`,
                    status: statusCode.unauthorized,
                })
            }
        }
        const base64ProfilePicture = await userService.getBased64profilePicture(user);
        res.status(200).send(base64ProfilePicture);

    } catch (err) {
        next(err)
    }
}

export async function getUpdatedProfilePicture(req: Request, res: Response, next: Function) {
    const profilePictureID = req.query.profilePictureID?.toString();
    const userID = req.query._id;

    try {
        if (!profilePictureID) {
            throw new clientError({
                message: `profilePictureID not provided`,
                status: statusCode.badRequest,
            })
        }
        if (!userID) {
            throw new clientError({
                message: `userID not provided`,
                status: statusCode.badRequest,
            })
        }

        const user = await userModel.findById(userID);

        if (!user) {
            throw new clientError({
                message: "No User Found",
                status: statusCode.notfound,
            })
        }

        if (user.organization != req.user.organization) {
            throw new clientError({
                message: "You are not authorized to access this resource",
                status: statusCode.unauthorized,
            })
        }
        const profilePicture = user.profilePicture;
        if (!profilePicture) {
            throw new clientError({
                message: "No Profile Picture Found",
                status: statusCode.notfound,
            })
        }
        res.status(200).sendFile(profilePicture, { root: "./" });
    } catch (err) {
        next(err)
    }
}









