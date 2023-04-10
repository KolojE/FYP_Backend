import { clientError, statusCode } from "../exception/errorHandler";
import { FormModel } from "../models/form";
import OrganizationModel, { Organization } from "../models/organization";
import ReportModel from "../models/report";
import { User } from "../models/user";
import { validationService } from "./validation.service";

type submission = {
    formID: string,
    field: Object,
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

        const organization: Organization | null = await OrganizationModel.findById(form.organization._id).exec();

        if (!organization) {
            throw new Error(`there is not organization ${form.organization._id} found`);
        }

        await validationService.validate_User_Belong_To_Organziation(user, organization._id);

        await validationService.fields_Validation(submission.field, form);

        const newReport = new ReportModel({
            date: new Date(),
            complainant: { _id: user._id, ID: user.ID },
            organization: { _id: organization._id, ID: organization.ID },
            form: { _id: form._id },
            status: { _id: organization.defaultStatus._id },
            details: submission.field
        })

        await newReport.save()







    }
}