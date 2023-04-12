import { clientError, statusCode } from "../exception/errorHandler";
import { IField, Form, FormModel, inputType } from "../models/form"
import userModel, { IUser } from "../models/user";
import { validationService } from "./validation.service";

export type newForm = {
    name: String,
    fields: Array<IField>,
    activation: boolean,
}

export namespace administratorService {
    export async function addNewForm(form: newForm, user: IUser): Promise<Form> {


        const newForm = new FormModel({
            name: form.name,
            fields: form.fields,
            activation_Status: form.activation,
            organization: {
                _id: user.organization._id,
                ID: user.organization.ID,
            }
        });

        return await newForm.save();
    }

    export async function updateForm(formToUpdate: Form): Promise<Form> {


        if (!formToUpdate._id) {
            throw new clientError( {
                message: "ID is not provided !",
                status: statusCode.badRequest,
            } )

        }
        const updatedForm = await FormModel.findByIdAndUpdate(
            formToUpdate._id, {$set: {
            name: formToUpdate.name,
            fields: formToUpdate.fields,
            activation_Status: formToUpdate.activation_Status,
            }
        }, { returnDocument: "after",runValidators:true }
        );

        if (!updatedForm) {
            throw new clientError({message:"Form not found !",status:statusCode.notfound})
        }

        return updatedForm
    }

    export async function updateMember(member: IUser): Promise<IUser> {
        if (!member._id) {
            throw new clientError({
                message: "User ID is not provided",
                status: statusCode.badRequest,
            }) 
        }

        if (validationService.is_Email(member.email)) {

        }

        const updatedMember = await userModel.findByIdAndUpdate(
            member._id, {
            $set: {
                contact: member.contact,
            }
        },
            { returnDocument: "after" }
        )

        if (!updatedMember) {
            throw new clientError({
                message: "Member not found!",
                status: statusCode.notfound
            })
        }

        return updatedMember;
    }
}

