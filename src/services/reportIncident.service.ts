import { clientError, statusCode } from "../exception/errorHandler";
import { FormModel } from "../models/form";
import { User } from "../models/user";
import { validationService } from "./validation.service";

type submission = {
    formID: string,
    field: [Object],
}

export namespace reportIncidentService {
    export async function reportIncident(submission: submission, user: User) {

        console.log(submission.formID)
        const form = await FormModel.findById(submission.formID).exec();

        if (!form) {
            throw {
                message: "form not found",
                status: statusCode.notfound,
                data: "Form Id provided is not exists in the database",
            } as clientError
        }

        await validationService.validate_User_Belong_To_Organziation(user, form.organization._id);

        await validationService.fields_Validation(submission.field, form);







    }
}