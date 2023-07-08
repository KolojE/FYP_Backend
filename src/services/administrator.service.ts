import { Request } from "express";
import { clientError, statusCode } from "../exception/errorHandler";
import complaiantModel from "../models/complainant";
import { IField, IForm, FormModel, inputType } from "../models/form"
import { IUser } from "../models/user";
import { FilterQuery, PipelineStage, isObjectIdOrHexString } from "mongoose";
import { ObjectId } from "mongodb";
import ExcelJS from "exceljs";
import { randomUUID } from "crypto";
import path from "path";
import ReportModel from "../models/report";

export type newForm = {
    name: String,
    fields: Array<IField>,
    icon:string,
    color: string,
    activation: boolean,
}

export namespace administratorService {


    export async function addNewForm(form: newForm, user: IUser): Promise<IForm> {

        const defaultFields = [{
            label: "Date Of Occurence",
            inputType: inputType.Date,
            required: true,
        }, {
            label: "Time of Occurence",
            inputType: inputType.Time,
            required: true,
        }, {
            label: "Location",
            inputType: inputType.Map,
            required: true,
        }]

        const newForm = new FormModel({
            name: form.name,
            defaultFields: defaultFields,
            fields: form.fields,
            activation_Status: form.activation,
            icon:form.icon,
            color: form.color,
            organization: user.organization._id,
            creationDate: new Date(),
        });

        return await newForm.save();
    }

    export async function updateForm(formToUpdate: IForm, user: IUser): Promise<IForm> {

        if (!formToUpdate._id) {
            throw new clientError({
                message: "ID is not provided !",
                status: statusCode.badRequest,
            })

        }

        const updatedForm = await FormModel.findByIdAndUpdate(
            formToUpdate._id, {
            $set: {
                name: formToUpdate.name,
                fields: formToUpdate.fields,
                color: formToUpdate.color,
                icon:formToUpdate.icon,
            }

        }, { returnDocument: "after", runValidators: true }
        ).where({ organization: user.organization })



        if (!updatedForm) {
            throw new clientError({ message: "Form not found !", status: statusCode.notfound })
        }

        return updatedForm
    }

    export async function updateMemberActivationStatus(id: string, activation: boolean, requester: IUser) {


        if (!isObjectIdOrHexString(id)) {
            throw new clientError({
                status: statusCode.badRequest,
                message: "ID invalid!"
            })
        }
        const complainant = await complaiantModel.findOne({
            'user': id
        }).populate({
            path: "user",
            match: {
                'organization': requester.organization._id
            }

        }).updateOne({
            $set: {
                activation: activation
            }
        })
        console.log(complainant)
    }

    export async function reportResultTransformer(result: any[]) {
        let reports: any[] = []
        console.log(result)
        result.map((report: any) => {
            const details = Object.entries(report.details).map(([key, value]: [string, any]) => {
                return {
                    ["_" + value.label]: value.value,
                }
            })

            report = {
                reportType: report.form.name,
                reportID: report._id,
                submissionDate: report.submissionDate,
                complainant: report.complainant,
                status: {
                    comment: report.status.comment,
                    status: report.currentStatus.desc,
                },
                report: details
            }
            reports.push(report)
        })

        return reports
    }

    export async function generateReportPDF(result: any[]) {

    }

    export async function generateReportExcel(result: any[]) {
        function flattenObject(obj: any, prefix = ''): any {
            let flattened: any = {};
            for (let key in obj) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    if (value instanceof ObjectId) {
                        flattened[`${prefix}${key}`] = value.toString(); // Convert ObjectId to string
                    } else {
                        const nested = flattenObject(value, `${prefix}${key}_`);
                        flattened = { ...flattened, ...nested };
                    }
                } else {
                    flattened[`${prefix}${key}`] = value;
                }
            }

            return flattened;
        }
        const worksheets: { [key: string]: ExcelJS.Worksheet } = {}

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('All Reports');

        const flattenedData = result.map((obj) => flattenObject(obj));

        console.log(flattenedData)
        // console.log(flattenedData)
        // Create headers array with all property names
        const headers = Array.from(new Set(flattenedData.flatMap((obj) => Object.keys(obj))));

        // Create a mapping of properties to column indices
        const columnMapping: any = {};
        headers.forEach((header, index) => {
            columnMapping[header] = index + 1; // Add 1 to account for header row
        });

        // Add headers to the worksheet
        worksheet.addRow(headers);

        // Add data rows to the worksheet
        flattenedData.forEach((obj) => {
            const rowData: any = [];
            let typeHeaders = "";
            const rowForType: any = [];
            let type = "";
            const headersAdded: { [key: string]: boolean } = {}; // Track added headers

            Object.entries(obj).forEach(([property, value]) => {
                if (property === "reportType") {
                    type = value as string;
                    if (!worksheets[type]) {
                        worksheets[type] = workbook.addWorksheet(type);
                    }
                }

                // Add headers if not already added
                if (!headersAdded[type]) {
                    const columnIndex = columnMapping[property];
                    typeHeaders += columnMapping[property] + ",";
                    const cell = worksheets[type]?.getCell(1, columnIndex); // Set header value
                    if (cell) {
                        cell.value = property;
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: '7df2ff' }, // Specify the desired color for the fill (e.g., red)
                        }
                    }
                }

                rowForType.push(value);
                const columnIndex = columnMapping[property];
                rowData[columnIndex] = value || ""; // Use placeholder value if property is missing
            });

            headersAdded[type] = true; // Mark header as added
            worksheet.addRow(rowData);
            worksheets[type]?.addRow(rowForType);
        });


        const firstRow = worksheet.getRow(1);
        firstRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '7df2ff' }, // Specify the desired color for the fill (e.g., red)
            };
        });

        worksheet.columns.forEach(column => {
            const lengths = column.values?.map(v => v?.toString().length);
            if (lengths === undefined) return;
            const maxLength = Math.max(...lengths.filter(v => typeof v === 'number')?.map(v => v as number));
            column.width = maxLength;
        });

        const fileName = path.join("reports", `${randomUUID()}.xlsx`); // Specify the desired file name
        await workbook.xlsx.writeFile(path.join("public", fileName));
        return fileName;
    }



    export function filterQueryBuilder(req: Request) {
        const user = req.user;
        const sortBy = req.query?.sortBy;
        const subDate = {
            fromDate: req.query?.subFromDate,
            toDate: req.query?.subToDate,
        };
        const status = req.query?.status?.toString().split(",");
        const type = req.query?.type?.toString().split(",");
        console.log(user)

        const query = ReportModel.find({
            organization: user.organization._id,
        })

        if (subDate.fromDate) {
            query.find({
                submissionDate: { $gte: new Date(subDate.fromDate.toString()) },
            })
        }
        if (subDate.toDate) {
            query.find({
                submissionDate: { $lte: new Date(subDate.toDate.toString()) },
            })
        }

        if (status || type) {
            const statuses = status?.map((id) => {
                return { "status": new ObjectId(id) }
            }) || []

            const types = type?.map((id) => {
                return { "form": new ObjectId(id) }
            }) || []

            const and = []

            if (statuses.length > 0) {
                and.push({ $or: statuses })
            }

            if (types.length > 0) { 
                and.push({ $or: types })
            }

            console.log(statuses)
            query.find({
                $and:and
                
            })
        }


        if (sortBy == "upDate") {
            query.sort({
                "updateDate": 1
            })
        }
        else {
            query.sort({
                "submissionDate": 1
            })
        }


        query.populate("status").populate("complainant").populate("form")

        return query

    }

}



