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
exports.deleteMemberController = exports.updateMemberActivationController = exports.viewMembersController = exports.deleteFormController = exports.updateFormController = exports.addFormController = void 0;
const complainant_1 = __importDefault(require("../models/complainant"));
const administrator_service_1 = require("../services/administrator.service");
const validation_service_1 = require("../services/validation.service");
const form_1 = require("../models/form");
const errorHandler_1 = require("../exception/errorHandler");
const user_1 = __importStar(require("../models/user"));
async function addFormController(req, res, next) {
    try {
        const newForm = req.body;
        const user = req.user;
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
        const deletedForm = await form_1.FormModel.deleteOne({ _id: formToDelete }).where({ organization: user.organization });
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
                    from: "users", localField: "user._id", foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "organizations", localField: "user.organization._id", foreignField: "_id",
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
        console.log(members);
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
        const deletedMember = await user_1.default.findOneAndDelete({
            _id: deleteUserId, role: user_1.role.complainant, "organization._id": user.organization._id
        });
        if (!deletedMember) {
            throw new errorHandler_1.clientError({
                message: `No member is deleted cause the ID associated to the member is not found or trying to delete admin account ${deleteUserId}`,
                status: errorHandler_1.statusCode.notfound,
            });
        }
    }
    catch (err) {
        next(err);
    }
}
exports.deleteMemberController = deleteMemberController;
//# sourceMappingURL=administrator.controller.js.map