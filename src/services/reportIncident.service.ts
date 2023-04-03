import { clientError, statusCode } from "../exception/errorHandler";
import { FormModel } from "../models/form";
import ReportModel from "../models/report";
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

        const newReport = new ReportModel({
            date: new Date(),
            complainant: { _id: user._id, ID: user.ID },
            organization: { _id: user._id, ID: user.ID },
            form: { _id: form._id },
            status: false,
            details: submission.field
        })

        await newReport.save()







    }
}