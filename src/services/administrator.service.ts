import { clientError, statusCode } from "../exception/errorHandler";
import { Form, formModel } from "../models/form"
import { User } from "../models/user";

type newForm = {
    name: String,
    fields: Array<Object>,
    activation: boolean,
}

export namespace administratorService {
    export async function addNewForm(form: newForm, user: User): Promise<Form> {

        console.log(form)
        const newForm = new formModel({
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
        const updatedForm = await formModel.findByIdAndUpdate(
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
}