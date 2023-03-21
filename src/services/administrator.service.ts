import { clientError, statusCode } from "../exception/errorHandler";
import { form, formModel } from "../models/form"
import { User } from "../models/user";

type newForm = {
    name: String,
    fields: Array<Object>,
}
export namespace administratorService {
    export async function addNewForm(form: newForm, user: User): Promise<form> {

        if (form.fields.length <= 0) {
            throw {
                message: "The form field cannot be empty !",
                status: statusCode.badRequest,
            } as clientError
        }

        const newForm = new formModel({
            name: form.name,
            fields: form.fields,
            activation_Status: true,
            organization: {
                _id: user.organization._id,
                ID: user.organization.ID,
            }
        });

        return await newForm.save();
    }
}