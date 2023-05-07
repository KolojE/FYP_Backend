import { Document } from "mongoose";
import { clientError, statusCode } from "../exception/errorHandler";
import { FormModel } from "../models/form";
import OrganizationModel, { IOrganization } from "../models/organization";
import ReportModel, { IReport } from "../models/report";
import { IUser } from "../models/user";
import { validationService } from "./validation.service";

type submission = {
    formID: string,
    field: Object,
}

export namespace reportIncidentService {
    export async function reportIncident(submission: submission, user: IUser) {

        console.log(submission.formID)
        const form = await FormModel.findById(submission.formID).exec();

        if (!form) {
            throw new clientError({
                message: "form not found",
                status: statusCode.notfound,
                data: "Form Id provided is not exists in the database",
            }) 
        }

        const organization: IOrganization | null = await OrganizationModel.findById(form.organization._id).exec();

        if (!organization) {
            throw new Error(`there is not organization ${form.organization._id} found`);
        }

        await validationService.validate_User_Belong_To_Organziation(user, organization._id);

        await validationService.fields_Validation(submission.field, form);
        const newReport = new ReportModel<Omit<IReport,keyof Document|"ID">>({
            updateDate:new Date(),
            submissionDate:new Date(),
            complainant: { _id: user._id, ID: user.ID },
            organization: { _id: organization._id, ID: organization.ID },
            form_id: form._id,
            status: { _id: organization.defaultStatus._id,comment:"Incident Reprot Submitted." },
            details: submission.field
        })

        await newReport.save()







    }
}