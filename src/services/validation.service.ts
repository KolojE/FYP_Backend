import { clientError, statusCode } from "../exception/errorHandler";
import userModel from "../models/user";


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

}