import { clientError, statusCode } from "../exception/errorHandler";
import { field, Form, FormModel, inputType } from "../models/form"
import userModel, { User } from "../models/user";
import { validationService } from "./validation.service";

export type newForm = {
    name: String,
    fields: Array<field>,
    activation: boolean,
}

export namespace administratorService {
    export async function addNewForm(form: newForm, user: User): Promise<Form> {


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
            throw {
                message: "ID is not provided !",
                status: statusCode.badRequest,
            } as clientError

        }
        const updatedForm = await FormModel.findByIdAndUpdate(
            formToUpdate._id, {
            name: formToUpdate.name,
            fields: formToUpdate.fields,
            activation_Status: formToUpdate.activation_Status,
        }, { returnDocument: "after" }
        );

        if (!updatedForm) {
            throw {
                message: "Form not found !",
                status: statusCode.notfound
            } as clientError
        }

        return updatedForm
    }

    export async function updateMember(member: User): Promise<User> {
        if (!member._id) {
            throw {
                message: "User ID is not provided",
                status: statusCode.badRequest,
            } as clientError
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
            throw {
                message: "Member not found!",
                status: statusCode.notfound
            } as clientError
        }

        return updatedMember;
    }
}

