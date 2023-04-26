"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMembersController = exports.viewMembersController = exports.deleteFormController = exports.updateFormController = exports.addFormController = void 0;
const complainant_1 = __importDefault(require("../models/complainant"));
const administrator_service_1 = require("../services/administrator.service");
const validation_service_1 = require("../services/validation.service");
const form_1 = require("../models/form");
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
async function updateMembersController(req, res, next) {
    try {
        const member = req.body;
        const updatedMember = await administrator_service_1.administratorService.updateMember(member);
        res.status(200).json({
            message: "successfully updated member",
            data: updatedMember,
        }).send();
    }
    catch (err) {
        next(err);
    }
}
exports.updateMembersController = updateMembersController;
//# sourceMappingURL=administrator.controller.js.map