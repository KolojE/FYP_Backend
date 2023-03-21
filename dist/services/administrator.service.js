"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.administratorService = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const form_1 = require("../models/form");
var administratorService;
(function (administratorService) {
    async function addNewForm(form, user) {
        if (form.fields.length <= 0) {
            throw {
                message: "The form field cannot be empty !",
                status: errorHandler_1.statusCode.badRequest,
            };
        }
        const newForm = new form_1.formModel({
            name: form.name,
            fields: form.fields,
            activation_Status: true,
            organization: {
                _id: user.organization._id,
                ID: user.organization.ID,
            }
        });
        return await newForm.save();
    }
    administratorService.addNewForm = addNewForm;
})(administratorService = exports.administratorService || (exports.administratorService = {}));
//# sourceMappingURL=administrator.service.js.map