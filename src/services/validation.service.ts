import { clientError, statusCode } from "../exception/errorHandler";
import { IForm, inputType } from "../models/form";
import userModel, { IUser } from "../models/user";
import { newForm } from "./administrator.service";
import { generateSchema } from "../utils/joi";
import { Types } from "mongoose";
import complaiantModel from "../models/complainant";


export namespace validationService {
    export function is_Email(email: string): boolean {
        const regExp: RegExp = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
        return regExp.test(email);
    }

    export async function check_Email_Availability(email: String) {

        //check if it exists in conplainants 
        if (await userModel.exists({ email: email }) !== null) {
            throw new clientError({
                data: email,
                message: "Email already exits",
                status: statusCode.conflict,
            })

        }
    }


    export function form_Validation(form: newForm | IForm) {
        form.fields.forEach((field) => {
            if (!Object.values(inputType).includes(field.inputType)) {
                throw new clientError({
                    message: `Input type ${field.inputType} is not valid !`,
                    data: `valid types are ${Object.values(inputType)}`,
                    status: statusCode.badRequest,
                }) 
            }
        })
    }

    export function validate_User_Belong_To_Organziation(user: IUser, organizationID: Types.ObjectId) {

        if (!user.organization._id.equals(organizationID)) {
            throw new clientError({
                message: "You are not authorized to process !",
                status: statusCode.unauthorized,
                data: "Invlid action",

            }) 
        }
    }

    export async function is_Complinant_Active(user: IUser) {
        const complainant = await complaiantModel.findOne({ "user._id": user._id });
        if (!complainant) {
            throw new clientError({
                message: "You are not authorized to process !",
                status: statusCode.unauthorized,
                data: "Invlid action",
            }) 
        }
        if (!complainant.activation) {
            throw new clientError({
                message: "Account is not activated ! Please contact the administrator",
                status: statusCode.unauthorized,
                data: "Invlid action",
            })
        }

    }

    export async function fields_Validation(field: Object, form: IForm) {

        console.log(field)
        const Schema = generateSchema(form);
        try {
            await Schema.validateAsync(field);
        } catch (err) {
            throw new clientError({
                message: "Failed to validate the form's fields",
                status: statusCode.badRequest,
                data: err,
            })
        }
    }
}
