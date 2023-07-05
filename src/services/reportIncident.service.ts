import { Document } from "mongoose";
import { clientError, statusCode } from "../exception/errorHandler";
import { FormModel, inputType } from "../models/form";
import OrganizationModel, { IOrganization } from "../models/organization";
import ReportModel, { IDetails, IReport } from "../models/report";
import { IUser } from "../models/user";
import { validationService } from "./validation.service";
import { report } from "process";

type submission = {
    formID: string,
    field: {
        [key: string]: any
    },
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
        const reportLocation: {
            latitude: number | null,
            longitude: number | null,
        } = {
            latitude: null,
            longitude: null,
        }

        const details: IDetails = {}
        form.fields.forEach(field => {
            const fieldID = field._id as string
            details[fieldID] = {
                value: "",
                label: "",
                inputType: inputType.Text,
            }
            details[fieldID].value = submission.field[fieldID]
            details[fieldID].label = field.label
            details[fieldID].inputType = field.inputType

            if (!reportLocation.latitude && !reportLocation.longitude && field.inputType === inputType.Map) {
                reportLocation.latitude = submission.field[fieldID].La
                reportLocation.longitude = submission.field[fieldID].Lo
            }
        })

        if (organization.system.defaultStatus === undefined) {
            throw new Error("there is no default status in the organization! please contact the administrator")
        }

        console.log(reportLocation)
        const newReport = new ReportModel<Omit<IReport, keyof Document | "ID">>({
            updateDate: new Date(),
            submissionDate: new Date(),
            location: {
                latitude: reportLocation.latitude as number,
                longitude: reportLocation.longitude as number,
            },
            complainant: { _id: user._id, ID: user.ID },
            organization: { _id: organization._id, ID: organization.ID },
            form_id: form._id,
            status: { _id: organization.system.defaultStatus._id, comment: "Report Submitted" },
            details: { ...details },
        })

        await newReport.save()







    }
}