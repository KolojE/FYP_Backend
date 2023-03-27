"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMembersController = exports.viewMembersController = exports.updateFormController = exports.addFormController = void 0;
const complainant_1 = __importDefault(require("../models/complainant"));
const administrator_service_1 = require("../services/administrator.service");
async function addFormController(req, res, next) {
    try {
        const newForm = req.body;
        const user = req.user;
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
        const updatedForm = await administrator_service_1.administratorService.updateForm(updateForm);
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
async function viewMembersController(req, res, next) {
    try {
        const members = await complainant_1.default.aggregate([{
                $lookup: {
                    from: "users", localField: "User._id", foreignField: "_id",
                    as: "User"
                }
            }]);
        res.status(200).json({
            message: "successfully get all members info",
            data: members
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