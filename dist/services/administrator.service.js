"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.administratorService = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const form_1 = require("../models/form");
const user_1 = __importDefault(require("../models/user"));
const validation_service_1 = require("./validation.service");
var administratorService;
(function (administratorService) {
    async function addNewForm(form, user) {
        const newForm = new form_1.FormModel({
            name: form.name,
            fields: form.fields,
            activation_Status: form.activation,
            organization: {
                _id: user.organization._id,
                ID: user.organization.ID,
            }
        });
        return await newForm.save();
    }
    administratorService.addNewForm = addNewForm;
    async function updateForm(formToUpdate) {
        if (!formToUpdate._id) {
            throw {
                message: "ID is not provided !",
                status: errorHandler_1.statusCode.badRequest,
            };
        }
        const updatedForm = await form_1.FormModel.findByIdAndUpdate(formToUpdate._id, { $set: {
                name: formToUpdate.name,
                fields: formToUpdate.fields,
                activation_Status: formToUpdate.activation_Status,
            }
        }, { returnDocument: "after", runValidators: true });
        if (!updatedForm) {
            throw {
                message: "Form not found !",
                status: errorHandler_1.statusCode.notfound
            };
        }
        return updatedForm;
    }
    administratorService.updateForm = updateForm;
    async function updateMember(member) {
        if (!member._id) {
            throw {
                message: "User ID is not provided",
                status: errorHandler_1.statusCode.badRequest,
            };
        }
        if (validation_service_1.validationService.is_Email(member.email)) {
        }
        const updatedMember = await user_1.default.findByIdAndUpdate(member._id, {
            $set: {
                contact: member.contact,
            }
        }, { returnDocument: "after" });
        if (!updatedMember) {
            throw {
                message: "Member not found!",
                status: errorHandler_1.statusCode.notfound
            };
        }
        return updatedMember;
    }
    administratorService.updateMember = updateMember;
})(administratorService = exports.administratorService || (exports.administratorService = {}));
//# sourceMappingURL=administrator.service.js.map