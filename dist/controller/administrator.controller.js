"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportController = exports.updateOrganization = exports.getReportExcelController = exports.getReportController = exports.deleteMemberController = exports.updateMemberActivationController = exports.viewMembersController = exports.deleteFormController = exports.updateFormController = exports.addFormController = void 0;
const complainant_1 = __importDefault(require("../models/complainant"));
const administrator_service_1 = require("../services/administrator.service");
const validation_service_1 = require("../services/validation.service");
const form_1 = require("../models/form");
const errorHandler_1 = require("../exception/errorHandler");
const user_1 = __importStar(require("../models/user"));
const mongoose_1 = __importStar(require("mongoose"));
const report_1 = __importDefault(require("../models/report"));
const status_1 = __importDefault(require("../models/status"));
const mongodb_1 = require("mongodb");
const organization_1 = __importDefault(require("../models/organization"));
const administrator_1 = __importDefault(require("../models/administrator"));
async function addFormController(req, res, next) {
    try {
        const newForm = req.body;
        const user = req.user;
        console.log(newForm);
        await validation_service_1.validationService.form_Validation(newForm);
        const form = await administrator_service_1.administratorService.addNewForm(newForm, user);
        res.status(200).json({
            message: "successfully added new form",
            data: form,
        });
    }
    catch (err) {
        next(err);
    }
}
exports.addFormController = addFormController;
async function updateFormController(req, res, next) {
    try {
        const updateForm = req.body;
        await validation_service_1.validationService.form_Validation(updateForm);
        const updatedForm = await administrator_service_1.administratorService.updateForm(updateForm, req.user);
        console.log(`Form ${updateForm._id} is updated. `, updatedForm, updateForm);
        res.status(200).json({
            message: "successfully updated form",
            data: updatedForm,
        }).send();
    }
    catch (err) {
        next(err);
    }
}
exports.updateFormController = updateFormController;
async function deleteFormController(req, res, next) {
    try {
        const formToDelete = req.query._id;
        const user = req.user;
        const deletedForm = await form_1.FormModel.findOneAndUpdate({
            _id: formToDelete,
            organization: user.organization
        }, {
            $set: {
                isDeleted: true
            }
        });
        console.log(`Form ${formToDelete} is deleted. `);
        res.status(200).json({
            message: `sucessfully deleted form ${formToDelete}`,
            data: deletedForm
        });
    }
    catch (err) {
        next(err);
    }
}
exports.deleteFormController = deleteFormController;
async function viewMembersController(req, res, next) {
    try {
        const members = await complainant_1.default.aggregate([
            {
                $lookup: {
                    from: "users", localField: "user", foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "organizations", localField: "user.organization", foreignField: "_id",
                    as: "organization"
                }
            },
            {
                $match: {
                    'user.organization': req.user.organization
                }
            },
            {
                $unwind: "$user"
            },
            {
                $unwind: "$organization"
            },
            {
                $project: {
                    "user.password": 0,
                    "user.organization": 0,
                }
            }
        ]);
        res.status(200).json({
            message: "successfully get all members info",
            members: members
        });
    }
    catch (err) {
        next(err);
    }
}
exports.viewMembersController = viewMembersController;
async function updateMemberActivationController(req, res, next) {
    try {
        const body = req.body;
        console.log(body);
        const updatedMember = await administrator_service_1.administratorService.updateMemberActivationStatus(body.id, body.activation, req.user);
        res.status(200).json({
            message: "successfully updated member",
            data: updatedMember,
        }).send();
    }
    catch (err) {
        next(err);
    }
}
exports.updateMemberActivationController = updateMemberActivationController;
async function deleteMemberController(req, res, next) {
    try {
        const user = req.user;
        const deleteUserId = req.query._id;
        const deletedMember = await user_1.default.findOne({ _id: deleteUserId, role: user_1.role.complainant, "organization": user.organization });
        const deletedComplainant = await complainant_1.default.findOne({ user: deleteUserId });
        if (!deletedComplainant) {
            throw new errorHandler_1.clientError({
                message: `No member is deleted cause the ID associated to the member is not found or trying to delete admin account ${deleteUserId}`,
                status: errorHandler_1.statusCode.notfound,
            });
        }
        if (deletedComplainant.activation) {
            throw new errorHandler_1.clientError({
                message: `No member is deleted cause the member is activated ${deleteUserId}`,
                status: errorHandler_1.statusCode.notfound,
            });
        }
        if (!deletedMember) {
            throw new errorHandler_1.clientError({
                message: `No member is deleted cause the ID associated to the member is not found or trying to delete admin account ${deleteUserId}`,
                status: errorHandler_1.statusCode.notfound,
            });
        }
        res.status(200).json({
            message: `successfully deleted member ${deleteUserId}`,
            data: deletedMember,
        }).send();
    }
    catch (err) {
        next(err);
    }
}
exports.deleteMemberController = deleteMemberController;
async function getReportController(req, res, next) {
    try {
        console.log(req.query);
        if (req.query.reportID) {
            const reportID = req.query.reportID;
            const report = await report_1.default.findOne({
                _id: reportID,
                "organization": req.user.organization._id
            }).populate("status").populate("form").populate({
                path: "complainant",
                select: "-password -organization",
                options: { lean: true },
                justOne: true,
            }).lean();
            console.log(report);
            if (!report) {
                throw new errorHandler_1.clientError({
                    message: `Report with id ${reportID} is not found`,
                    status: errorHandler_1.statusCode.notfound,
                });
            }
            res.status(200).send({
                message: `Successfully returned report`,
                report: report,
            });
            return;
        }
        const query = administrator_service_1.administratorService.filterQueryBuilder(req);
        const result = await query.exec();
        console.log(result);
        res.status(200).send({
            message: `Successfully returned reports for organization`,
            reports: result,
        });
    }
    catch (err) {
        next(err);
    }
}
exports.getReportController = getReportController;
async function getReportExcelController(req, res, next) {
    try {
        const pipeline = administrator_service_1.administratorService.filterQueryBuilder(req);
        const result = await pipeline.exec();
        const transformedResult = await administrator_service_1.administratorService.reportResultTransformer(result);
        const reportExcel = await administrator_service_1.administratorService.generateReportExcel(transformedResult);
        res.status(200).send({
            fileUrl: reportExcel,
        });
    }
    catch (err) {
        next(err);
    }
}
exports.getReportExcelController = getReportExcelController;
async function updateOrganization(req, res, next) {
    const user = req.user;
    const organizationToUpdate = req.body.organization;
    const stattusesToUpdateAndCreate = req.body.statuses;
    const statusesToDelete = req.body.statusesToDelete;
    const statusReplacementMapper = req.body.statusReplacementMapper;
    const defaultStatusID = organizationToUpdate.system.defaultStatus;
    try {
        const organization = await organization_1.default.findOne({ _id: user.organization });
        if (!organization) {
            throw new errorHandler_1.clientError({
                message: `Organization not found`,
                status: errorHandler_1.statusCode.notfound,
            });
        }
        if (user.organization._id != organizationToUpdate._id) {
            throw new errorHandler_1.clientError({
                message: `You are not authorized to update organization`,
                status: errorHandler_1.statusCode.unauthorized,
            });
        }
        const newStatuesOldIDs = [];
        const newStatuses = [];
        const updatedStatuses = [];
        const deletedStatuses = [];
        if (stattusesToUpdateAndCreate) {
            for (let i = 0; i < stattusesToUpdateAndCreate.length; i++) {
                const status = stattusesToUpdateAndCreate[i];
                let newID = "";
                if (!(0, mongoose_1.isObjectIdOrHexString)(status._id)) {
                    const newStatus = new status_1.default({
                        desc: status.desc,
                        organization: user.organization,
                    });
                    newStatuses.push(newStatus);
                    newStatuesOldIDs.push(status._id.toString());
                    newID = newStatus._id.toHexString();
                }
                else {
                    const updatedStatus = await status_1.default.findOne({ _id: status._id, "organization": user.organization });
                    if (!updatedStatus) {
                        throw new errorHandler_1.clientError({
                            message: `no status with id ${status._id} was found`,
                            status: errorHandler_1.statusCode.notfound,
                        });
                    }
                    updatedStatus.desc = status.desc;
                    updatedStatuses.push(updatedStatus);
                    newID = updatedStatus._id.toHexString();
                }
                if (status._id == defaultStatusID) {
                    const ID = new mongoose_1.default.Types.ObjectId(newID);
                    organizationToUpdate.system.defaultStatus = ID;
                }
            }
        }
        const reportsToUpdateQueries = [];
        if (statusReplacementMapper) {
            Object.keys(statusReplacementMapper).forEach((key) => {
                const reportWithStatusID = key;
                const updateReportToStatusID = statusReplacementMapper[key];
                if (!(0, mongoose_1.isObjectIdOrHexString)(reportWithStatusID)) {
                    throw new errorHandler_1.clientError({
                        message: `report id ${reportWithStatusID} is not a valid id`,
                        status: errorHandler_1.statusCode.badRequest,
                    });
                }
                if (!(0, mongoose_1.isObjectIdOrHexString)(updateReportToStatusID)) {
                    const newStatusHexIDIndex = newStatuesOldIDs.findIndex((status) => status == updateReportToStatusID);
                    if (newStatusHexIDIndex == -1) {
                        throw new errorHandler_1.clientError({
                            message: `status id ${updateReportToStatusID} is not a valid id`,
                            status: errorHandler_1.statusCode.badRequest,
                        });
                    }
                    const newStattusHexID = newStatuses[newStatusHexIDIndex]._id.toHexString();
                    statusReplacementMapper[key] = newStattusHexID;
                }
                reportsToUpdateQueries.push(report_1.default.updateMany({
                    status: key,
                    organization: user.organization,
                }, {
                    status: statusReplacementMapper[key],
                }));
            });
        }
        if (statusesToDelete) {
            for (let i = 0; i < statusesToDelete.length; i++) {
                const status = statusesToDelete[i];
                if (!(0, mongoose_1.isObjectIdOrHexString)(status._id)) {
                    throw new errorHandler_1.clientError({
                        message: `status to be delete id ${status._id} is not a valid id`,
                        status: errorHandler_1.statusCode.notfound,
                    });
                }
                const deletedStatus = await status_1.default.findOne({ _id: status._id, "organization": user.organization });
                if (!deletedStatus) {
                    throw new errorHandler_1.clientError({
                        message: `no status with id ${status._id} was found`,
                        status: errorHandler_1.statusCode.notfound,
                    });
                }
                if (deletedStatus._id === organization.system.defaultStatus) {
                    throw new errorHandler_1.clientError({
                        message: `default status cannot be deleted`,
                        status: errorHandler_1.statusCode.badRequest,
                    });
                }
                deletedStatuses.push(deletedStatus);
            }
        }
        if (organizationToUpdate) {
            await organization_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(user.organization) }, {
                name: organizationToUpdate.name,
                contactNo: organizationToUpdate.contactNo,
                address: organizationToUpdate.address,
                "system.defaultStatus": organizationToUpdate.system.defaultStatus,
                "system.autoActiveNewUser": organizationToUpdate.system.autoActiveNewUser,
            }, { new: true }).lean();
        }
        console.log(deletedStatuses);
        if (newStatuses.length > 0) {
            await status_1.default.insertMany(newStatuses);
        }
        if (deletedStatuses.length > 0) {
            await status_1.default.deleteMany({ $or: statusesToDelete.map((status) => ({ _id: status._id })) });
        }
        if (updatedStatuses.length > 0) {
            await status_1.default.bulkWrite(updatedStatuses.map((status) => ({
                updateOne: {
                    filter: { _id: status._id },
                    update: { desc: status.desc },
                }
            })));
        }
        const updatedReport = await Promise.all(reportsToUpdateQueries);
        const updatedNewStatuses = await status_1.default.find({ "organization": user.organization }).select({ organization: 0 });
        const updatedOrganization = await organization_1.default.findOne({ _id: user.organization });
        res.status(200).send({
            message: "succesfully updated organization ",
            organization: updatedOrganization,
            statuses: updatedNewStatuses,
        });
    }
    catch (err) {
        next(err);
    }
}
exports.updateOrganization = updateOrganization;
async function updateReportController(req, res, next) {
    console.log(req.body);
    const user = req.user;
    const reportID = req.body.reportID;
    const reportStatus = req.body.status;
    const reportComment = req.body.comment;
    try {
        const status = await status_1.default.findOne({ _id: reportStatus, "organization": user.organization._id });
        if (!status) {
            throw new errorHandler_1.clientError({
                message: `status not found`,
                status: errorHandler_1.statusCode.notfound,
            });
        }
        const adminID = await administrator_1.default.findOne({ "user": user._id }).select('_id');
        const report = await report_1.default.findOneAndUpdate({ _id: reportID, "organization": user.organization._id }, {
            $set: {
                status: status._id,
                comment: {
                    comment: reportComment,
                    admin: adminID,
                },
            }
        }, {
            new: true,
        }).populate({
            path: 'status',
        });
        console.log(JSON.stringify(report, null, 2));
        if (!report) {
            throw new errorHandler_1.clientError({
                message: `report not found`,
                status: errorHandler_1.statusCode.notfound,
            });
        }
        console.log(report.status._id);
        res.status(200).send({
            message: "succesfully updated report ",
            report: report,
        });
    }
    catch (err) {
        next(err);
    }
}
exports.updateReportController = updateReportController;
//# sourceMappingURL=administrator.controller.js.map