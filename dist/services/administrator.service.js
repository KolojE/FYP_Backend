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
const report_1 = __importDefault(require("../models/report"));
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
            icon: form.icon,
            color: form.color,
            organization: user.organization._id,
            creationDate: new Date(),
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
                color: formToUpdate.color,
                icon: formToUpdate.icon,
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
    async function generateReportPDF(result) {
    }
    administratorService.generateReportPDF = generateReportPDF;
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
        const worksheets = {};
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('All Reports');
        const flattenedData = result.map((obj) => flattenObject(obj));
        console.log(flattenedData);
        const headers = Array.from(new Set(flattenedData.flatMap((obj) => Object.keys(obj))));
        const columnMapping = {};
        headers.forEach((header, index) => {
            columnMapping[header] = index + 1;
        });
        worksheet.addRow(headers);
        flattenedData.forEach((obj) => {
            var _a;
            const rowData = [];
            let typeHeaders = "";
            const rowForType = [];
            let type = "";
            const headersAdded = {};
            Object.entries(obj).forEach(([property, value]) => {
                var _a;
                if (property === "reportType") {
                    type = value;
                    if (!worksheets[type]) {
                        worksheets[type] = workbook.addWorksheet(type);
                    }
                }
                if (!headersAdded[type]) {
                    const columnIndex = columnMapping[property];
                    typeHeaders += columnMapping[property] + ",";
                    const cell = (_a = worksheets[type]) === null || _a === void 0 ? void 0 : _a.getCell(1, columnIndex);
                    if (cell) {
                        cell.value = property;
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: '7df2ff' },
                        };
                    }
                }
                rowForType.push(value);
                const columnIndex = columnMapping[property];
                rowData[columnIndex] = value || "";
            });
            headersAdded[type] = true;
            worksheet.addRow(rowData);
            (_a = worksheets[type]) === null || _a === void 0 ? void 0 : _a.addRow(rowForType);
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
    function filterQueryBuilder(req) {
        var _a, _b, _c, _d, _e, _f, _g;
        const user = req.user;
        const sortBy = (_a = req.query) === null || _a === void 0 ? void 0 : _a.sortBy;
        const subDate = {
            fromDate: (_b = req.query) === null || _b === void 0 ? void 0 : _b.subFromDate,
            toDate: (_c = req.query) === null || _c === void 0 ? void 0 : _c.subToDate,
        };
        const status = (_e = (_d = req.query) === null || _d === void 0 ? void 0 : _d.status) === null || _e === void 0 ? void 0 : _e.toString().split(",");
        const type = (_g = (_f = req.query) === null || _f === void 0 ? void 0 : _f.type) === null || _g === void 0 ? void 0 : _g.toString().split(",");
        console.log(user);
        const query = report_1.default.find({
            organization: user.organization._id,
        });
        if (subDate.fromDate) {
            query.find({
                submissionDate: { $gte: new Date(subDate.fromDate.toString()) },
            });
        }
        if (subDate.toDate) {
            query.find({
                submissionDate: { $lte: new Date(subDate.toDate.toString()) },
            });
        }
        if (status || type) {
            const statuses = (status === null || status === void 0 ? void 0 : status.map((id) => {
                return { "status": new mongodb_1.ObjectId(id) };
            })) || [];
            const types = (type === null || type === void 0 ? void 0 : type.map((id) => {
                return { "form": new mongodb_1.ObjectId(id) };
            })) || [];
            const and = [];
            if (statuses.length > 0) {
                and.push({ $or: statuses });
            }
            if (types.length > 0) {
                and.push({ $or: types });
            }
            console.log(statuses);
            query.find({
                $and: and
            });
        }
        if (sortBy == "upDate") {
            query.sort({
                "updateDate": 1
            });
        }
        else {
            query.sort({
                "submissionDate": 1
            });
        }
        query.populate("status").populate("complainant").populate("form");
        return query;
    }
    administratorService.filterQueryBuilder = filterQueryBuilder;
})(administratorService = exports.administratorService || (exports.administratorService = {}));
//# sourceMappingURL=administrator.service.js.map