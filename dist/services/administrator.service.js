"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.administratorService = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const form_1 = require("../models/form");
var administratorService;
(function (administratorService) {
    async function addNewForm(form, user) {
        console.log(form);
        const newForm = new form_1.formModel({
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
        const updatedForm = await form_1.formModel.findByIdAndUpdate(formToUpdate._id, {
            name: formToUpdate.name,
            fields: formToUpdate.fields,
            activation_Status: formToUpdate.activation_Status,
        }, { returnDocument: "after" });
        if (!updatedForm) {
            throw {
                message: "Form not found !",
                status: errorHandler_1.statusCode.notfound
            };
        }
        return updatedForm;
    }
    administratorService.updateForm = updateForm;
})(administratorService = exports.administratorService || (exports.administratorService = {}));
//# sourceMappingURL=administrator.service.js.map