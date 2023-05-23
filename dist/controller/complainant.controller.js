"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportController = exports.reportPhotoUploadController = exports.reportIncidentController = void 0;
const reportIncident_service_1 = require("../services/reportIncident.service");
const report_1 = __importDefault(require("../models/report"));
const errorHandler_1 = require("../exception/errorHandler");
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
async function reportPhotoUploadController(req, res, next) {
    try {
        const file = req.file;
        if (!file) {
            throw new errorHandler_1.clientError({
                message: "No File Uploaded",
                status: errorHandler_1.statusCode.badRequest,
            });
        }
        res.status(200).json({
            message: `Photo Uploaded Successfully path is ${file.path}`,
            filePath: file.path
        });
    }
    catch (err) {
        next(err);
    }
}
exports.reportPhotoUploadController = reportPhotoUploadController;
async function getReportController(req, res, next) {
    var _a, _b, _c, _d;
    try {
        const user = req.user;
        const limit = (_a = req.query) === null || _a === void 0 ? void 0 : _a.limit;
        const subDate = {
            fromDate: (_b = req.query) === null || _b === void 0 ? void 0 : _b.subFromDate,
            toDate: (_c = req.query) === null || _c === void 0 ? void 0 : _c.subToDate
        };
        const sortBy = (_d = req.query) === null || _d === void 0 ? void 0 : _d.sortBy;
        const pipeline = [
            {
                $match: {
                    "complainant._id": user._id,
                    "organization._id": user.organization._id,
                },
            },
            {
                $lookup: {
                    from: "forms",
                    localField: "form_id",
                    foreignField: "_id",
                    as: "form",
                },
            },
            {
                $addFields: {
                    "comment": "$status.comment",
                }
            },
            {
                $lookup: {
                    from: "status",
                    localField: "status._id",
                    foreignField: "_id",
                    as: "status",
                }
            },
            {
                $unwind: "$form"
            },
            {
                $unwind: "$status"
            },
            {
                $addFields: {
                    "name": "$form.name",
                    "status": "$status.desc",
                }
            },
            {
                $project: {
                    "form": 0,
                }
            },
        ];
        if (subDate.fromDate) {
            console.log(subDate);
            pipeline.push({
                $match: {
                    submissionDate: {
                        $gte: new Date(subDate.fromDate)
                    }
                }
            });
        }
        if (subDate.toDate) {
            pipeline.push({
                $match: {
                    submissionDate: {
                        $lte: new Date(subDate.toDate),
                    }
                }
            });
        }
        if (sortBy === "subDate") {
            console.log("sort by sub Date");
            pipeline.push({
                $sort: {
                    submissionDate: -1,
                }
            });
        }
        else if (sortBy === "upDate") {
            console.log("sort By up Date");
            pipeline.push({
                $sort: {
                    updateDate: -1,
                }
            });
        }
        if (limit) {
            pipeline.push({
                $limit: Number(limit)
            });
        }
        const submittedReports = report_1.default.aggregate(pipeline);
        const reports = await submittedReports;
        console.log(subDate.fromDate);
        console.log(JSON.stringify(reports, null, 2));
        res.status(200).send({
            message: `successfully get the submitted reprots by User ${user._id}`,
            reports: reports
        });
    }
    catch (err) {
        next(err);
    }
}
exports.getReportController = getReportController;
//# sourceMappingURL=complainant.controller.js.map