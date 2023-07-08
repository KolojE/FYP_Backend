"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportController = exports.reportPhotoVideoUploadController = exports.reportIncidentController = void 0;
const reportIncident_service_1 = require("../services/reportIncident.service");
const report_1 = __importDefault(require("../models/report"));
const errorHandler_1 = require("../exception/errorHandler");
const mongodb_1 = require("mongodb");
async function reportIncidentController(req, res, next) {
    try {
        await reportIncident_service_1.reportIncidentService.reportIncident(req.body, req.user);
        res.status(200).json({
            message: "Vlidate sucess, report being saved"
        }).send();
    }
    catch (err) {
        next(err);
    }
}
exports.reportIncidentController = reportIncidentController;
async function reportPhotoVideoUploadController(req, res, next) {
    try {
        const file = req.file;
        if (!file) {
            throw new errorHandler_1.clientError({
                message: "No File Uploaded",
                status: errorHandler_1.statusCode.badRequest,
            });
        }
        file.path = file.path.replace(/\\/g, "/");
        file.path = file.path.replace("public", "");
        res.status(200).json({
            message: `Photo/Video Uploaded Successfully path is ${file.path}`,
            filePath: file.path
        });
    }
    catch (err) {
        next(err);
    }
}
exports.reportPhotoVideoUploadController = reportPhotoVideoUploadController;
async function getReportController(req, res, next) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const user = req.user;
        const limit = (_a = req.query) === null || _a === void 0 ? void 0 : _a.limit;
        const reportID = (_b = req.query) === null || _b === void 0 ? void 0 : _b.reportID;
        const subDate = {
            fromDate: (_c = req.query) === null || _c === void 0 ? void 0 : _c.subFromDate,
            toDate: (_d = req.query) === null || _d === void 0 ? void 0 : _d.subToDate
        };
        const sortBy = (_e = req.query) === null || _e === void 0 ? void 0 : _e.sortBy;
        const status = (_g = (_f = req.query) === null || _f === void 0 ? void 0 : _f.status) === null || _g === void 0 ? void 0 : _g.toString().split(",");
        const type = (_j = (_h = req.query) === null || _h === void 0 ? void 0 : _h.type) === null || _j === void 0 ? void 0 : _j.toString().split(",");
        if (reportID) {
            const report = await report_1.default.findOne({
                _id: reportID,
                "organization": user.organization._id,
                "complainant": user._id,
            }).populate("status").populate("form");
            if (!report) {
                throw new errorHandler_1.clientError({
                    message: `No Report Found with _id ${reportID}`,
                    status: errorHandler_1.statusCode.notfound,
                });
            }
            console.log(report);
            res.status(200).json({
                message: "Report Found",
                report: report
            });
            return;
        }
        const query = report_1.default.find({
            organization: user.organization._id,
            complainant: user._id,
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
        if (limit) {
            query.limit(parseInt(limit.toString()));
        }
        const result = await query.exec();
        console.log(JSON.stringify(result, null, 2));
        res.status(200).send({
            message: `successfully get the submitted reports by User ${user._id}`,
            reports: result
        });
    }
    catch (err) {
        next(err);
    }
}
exports.getReportController = getReportController;
//# sourceMappingURL=complainant.controller.js.map