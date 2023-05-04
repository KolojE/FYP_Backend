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
        }).updateOne({ $set: {
                activation: activation
            } });
        console.log(complainant);
    }
    administratorService.updateMemberActivationStatus = updateMemberActivationStatus;
})(administratorService = exports.administratorService || (exports.administratorService = {}));
//# sourceMappingURL=administrator.service.js.map