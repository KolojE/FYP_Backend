"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.administratorService = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const complainant_1 = __importDefault(require("../models/complainant"));
const form_1 = require("../models/form");
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const exceljs_1 = __importDefault(require("exceljs"));
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
var administratorService;
(function (administratorService) {
    async function addNewForm(form, user) {
        const defaultFields = [{
                label: "Date Of Occurence",
                inputType: form_1.inputType.Date,
                required: true,
            }, {
                label: "Time of Occurence",
                inputType: form_1.inputType.Time,
                required: true,
            }, {
                label: "Location",
                inputType: form_1.inputType.Map,
                required: true,
            }];
        const newForm = new form_1.FormModel({
            name: form.name,
            defaultFields: defaultFields,
            fields: form.fields,
            activation_Status: form.activation,
            organization: {
                _id: user.organization._id,
                ID: user.organization.ID,
            },
            creationDate: new Date()
        });
        return await newForm.save();
    }
    administratorService.addNewForm = addNewForm;
    async function updateForm(formToUpdate, user) {
        if (!formToUpdate._id) {
            throw new errorHandler_1.clientError({
                message: "ID is not provided !",
                status: errorHandler_1.statusCode.badRequest,
            });
        }
        const updatedForm = await form_1.FormModel.findByIdAndUpdate(formToUpdate._id, {
            $set: {
                name: formToUpdate.name,
                fields: formToUpdate.fields,
                activation_Status: formToUpdate.activation_Status,
            }
        }, { returnDocument: "after", runValidators: true }).where({ organization: user.organization });
        if (!updatedForm) {
            throw new errorHandler_1.clientError({ message: "Form not found !", status: errorHandler_1.statusCode.notfound });
        }
        return updatedForm;
    }
    administratorService.updateForm = updateForm;
    async function updateMemberActivationStatus(id, activation, requester) {
        if (!(0, mongoose_1.isObjectIdOrHexString)(id)) {
            throw new errorHandler_1.clientError({
                status: errorHandler_1.statusCode.badRequest,
                message: "ID invalid!"
            });
        }
        const complainant = await complainant_1.default.findOne({
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
        });
        console.log(complainant);
    }
    administratorService.updateMemberActivationStatus = updateMemberActivationStatus;
    async function reportResultTransformer(result) {
        let reports = [];
        console.log(result);
        result.map((report) => {
            const details = Object.entries(report.details).map(([key, value]) => {
                return {
                    ["_" + value.label]: value.value,
                };
            });
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
            };
            reports.push(report);
        });
        return reports;
    }
    administratorService.reportResultTransformer = reportResultTransformer;
    async function generateReportExcel(result) {
        function flattenObject(obj, prefix = '') {
            let flattened = {};
            for (let key in obj) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    if (value instanceof mongodb_1.ObjectId) {
                        flattened[`${prefix}${key}`] = value.toString();
                    }
                    else {
                        const nested = flattenObject(value, `${prefix}${key}_`);
                        flattened = Object.assign(Object.assign({}, flattened), nested);
                    }
                }
                else {
                    flattened[`${prefix}${key}`] = value;
                }
            }
            return flattened;
        }
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        console.log(result);
        const flattenedData = result.map((obj) => flattenObject(obj));
        const headers = Array.from(new Set(flattenedData.flatMap((obj) => Object.keys(obj))));
        const columnMapping = {};
        headers.forEach((header, index) => {
            columnMapping[header] = index + 1;
        });
        worksheet.addRow(headers);
        flattenedData.forEach((obj) => {
            const rowData = [];
            Object.entries(obj).forEach(([property, value]) => {
                const columnIndex = columnMapping[property];
                rowData[columnIndex] = value || '';
            });
            worksheet.addRow(rowData);
        });
        const firstRow = worksheet.getRow(1);
        firstRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '7df2ff' },
            };
        });
        worksheet.columns.forEach(column => {
            var _a, _b;
            const lengths = (_a = column.values) === null || _a === void 0 ? void 0 : _a.map(v => v === null || v === void 0 ? void 0 : v.toString().length);
            if (lengths === undefined)
                return;
            const maxLength = Math.max(...(_b = lengths.filter(v => typeof v === 'number')) === null || _b === void 0 ? void 0 : _b.map(v => v));
            column.width = maxLength;
        });
        const fileName = path_1.default.join("reports", `${(0, crypto_1.randomUUID)()}.xlsx`);
        await workbook.xlsx.writeFile(path_1.default.join("public", fileName));
        return fileName;
    }
    administratorService.generateReportExcel = generateReportExcel;
    function filterPipelineBuilder(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const user = req.user;
        const sortBy = (_a = req.query) === null || _a === void 0 ? void 0 : _a.sortBy;
        const groupByType = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.groupByType) ? true : false;
        const subDate = {
            fromDate: (_c = req.query) === null || _c === void 0 ? void 0 : _c.subFromDate,
            toDate: (_d = req.query) === null || _d === void 0 ? void 0 : _d.subToDate,
        };
        const status = (_f = (_e = req.query) === null || _e === void 0 ? void 0 : _e.status) === null || _f === void 0 ? void 0 : _f.toString().split(",");
        const type = (_h = (_g = req.query) === null || _g === void 0 ? void 0 : _g.type) === null || _h === void 0 ? void 0 : _h.toString().split(",");
        console.log("Grouped By Type : " + req.query.groupByType);
        const pipeline = [
            {
                $match: {
                    "organization._id": user.organization._id,
                },
            },
        ];
        if (subDate.fromDate) {
            console.log(subDate.fromDate);
            pipeline.push({
                $match: {
                    submissionDate: { $gte: new Date(subDate.fromDate.toString()) },
                }
            });
        }
        if (subDate.toDate) {
            pipeline.push({
                $match: {
                    submissionDate: { $lte: new Date(subDate.toDate.toString()) },
                }
            });
        }
        if (status) {
            const statuses = [];
            status.forEach((type) => {
                console.log(type);
                statuses.push({ "status._id": new mongodb_1.ObjectId(type) });
            });
            pipeline.push({
                $match: {
                    $or: statuses
                }
            });
        }
        if (type) {
            const types = [];
            type.forEach((type) => {
                console.log(type);
                types.push({ "form_id": new mongodb_1.ObjectId(type) });
            });
            pipeline.push({
                $match: {
                    $or: types
                }
            });
        }
        if (sortBy == "upDate") {
            pipeline.push({
                $sort: { "updateDate": 1 }
            });
        }
        else {
            pipeline.push({
                $sort: { "submissionDate": 1 }
            });
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
                    $unwind: "$status"
                },
                {
                    $addFields: {
                        "reports.status.desc": "$status.desc"
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
                        name: "$form.name"
                    }
                },
            ]);
        }
        else {
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
            ]);
        }
        return pipeline;
    }
    administratorService.filterPipelineBuilder = filterPipelineBuilder;
})(administratorService = exports.administratorService || (exports.administratorService = {}));
//# sourceMappingURL=administrator.service.js.map