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

export type newForm = {
    name: String,
    fields: Array<IField>,
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
            color:form.color,
            organization: {
                _id: user.organization._id,
                ID: user.organization.ID,
            },
            creationDate: new Date()
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
                activation_Status: formToUpdate.activation_Status,
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
            'user._id': id
        }).populate({
            path: "user._id",
            match: {
                'organization._id': requester.organization._id
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



    export function filterPipelineBuilder(req: Request): PipelineStage[] {
        const user = req.user;
        const sortBy = req.query?.sortBy;
        const groupByType = req.query?.groupByType ? true : false// group report by type, default to true
        const subDate = {
            fromDate: req.query?.subFromDate,
            toDate: req.query?.subToDate,
        };
        const status = req.query?.status?.toString().split(",");
        const type = req.query?.type?.toString().split(",");

        console.log("Grouped By Type : " + req.query.groupByType)
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    "organization._id": user.organization._id,
                },


            },
        ]

        if (subDate.fromDate) {
            console.log(subDate.fromDate)
            pipeline.push({
                $match: {
                    submissionDate: { $gte: new Date(subDate.fromDate.toString()) },
                }
            })
        }
        if (subDate.toDate) {
            pipeline.push({
                $match: {
                    submissionDate: { $lte: new Date(subDate.toDate.toString()) },
                }
            })
        }

        if (status) {
            const statuses: FilterQuery<any>[] = []// array of status to match from the query params - mongoose filter query
            status.forEach((type) => {
                console.log(type)
                statuses.push({ "status._id": new ObjectId(type) })
            })
            pipeline.push({
                $match: {
                    $or: statuses
                }
            })
        }

        if (type) {
            const types: FilterQuery<any>[] = []
            type.forEach((type) => {
                console.log(type)
                types.push({ "form_id": new ObjectId(type) })
            })
            pipeline.push({
                $match: {
                    $or: types

                }
            })
        }

        if (sortBy == "upDate") {
            pipeline.push({
                $sort: { "updateDate": 1 }
            })
        }
        else {
            pipeline.push({
                $sort: { "submissionDate": 1 }
            })
        }

        if (groupByType) {
            pipeline.push(...[
                {
                    $lookup: {
                        from: "status",
                        localField: "status._id",
                        foreignField: "_id",
                        as: "status"
                    }
                },
                {
                    $lookup: {
                        from:"users",
                        localField:"complainant._id",
                        foreignField:"_id",
                        as:"complainant"
                    }
                },
                {
                    $unwind:"$complainant",
                },
                {
                    $unwind: "$status"
                },
                {
                    $addFields: {
                        "reports.status.desc": "$status.desc",
                        "reports.status.comment": "$status.comment",
                    }
                },
                {
                    $group: {
                        _id: "$form_id",
                        reports: { $push: "$$ROOT" }
                    }
                }, {
                    $lookup: {
                        from: "forms",
                        localField: "_id",
                        foreignField: "_id",
                        as: "form"
                    }
                },
                {
                    $unwind: "$form"
                },
                {
                    $addFields: {
                        name: "$form.name",
                        color: "$form.color"
                    }
                },
            ])
        } else {
            pipeline.push(...[{
                $lookup: {
                    from: "forms",
                    localField: "form_id",
                    foreignField: "_id",
                    as: "form"
                }
            },
            {
                $unwind: "$form"
            },
            {
                $lookup: {
                    from: "status",
                    localField: "status._id",
                    foreignField: "_id",
                    as: "currentStatus"
                }

            },
            {
                $unwind: "$currentStatus"
            }
            ]
            )
        }
        return pipeline;
    }

}



