import { clientError, statusCode } from "../exception/errorHandler";
import { Form, inputType } from "../models/form";
import userModel, { IUser } from "../models/user";
import { newForm } from "./administrator.service";
import { generateSchema } from "../utils/joi";
import { Types } from "mongoose";


export namespace validationService {
    export function is_Email(email: string): boolean {
        const regExp: RegExp = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
        return regExp.test(email);
    }

    export async function check_Email_Availability(email: String) {

        //check if it exists in conplainants 
        if (await userModel.exists({ email: email }) !== null) {
            throw {
                data: email,
                message: "Email already exits",
                status: statusCode.conflict,
            } as clientError

        }
    }


    export function form_Validation(form: newForm | Form) {
        form.fields.forEach((field) => {
            if (!Object.values(inputType).includes(field.inputType)) {
                throw {
                    message: `Input type ${field.inputType} is not valid !`,
                    data: `valid types are ${Object.values(inputType)}`,
                    status: statusCode.badRequest,
                } as clientError
            }
        })
    }

    export function validate_User_Belong_To_Organziation(user: IUser, organizationID: Types.ObjectId) {

        if (!user.organization._id.equals(organizationID)) {
            throw {
                message: "You are not authorized to process !",
                status: statusCode.unauthorize,
                data: "Invlid action",

            } as clientError
        }
    }

    export async function fields_Validation(field: Object, form: Form) {

        console.log(field)
        const Schema = generateSchema(form);
        console.log(Schema)
        try {
            await Schema.validateAsync(field);
        } catch (err) {
            throw {
                message: "Failed to validate the form's fields",
                status: statusCode.badRequest,
                data: err,
            } as clientError
        }
    }
}
