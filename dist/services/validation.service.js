"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationService = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const form_1 = require("../models/form");
const user_1 = __importDefault(require("../models/user"));
const joi_1 = require("../utils/joi");
var validationService;
(function (validationService) {
    function is_Email(email) {
        const regExp = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
        return regExp.test(email);
    }
    validationService.is_Email = is_Email;
    async function check_Email_Availability(email) {
        if (await user_1.default.exists({ email: email }) !== null) {
            throw {
                data: email,
                message: "Email already exits",
                status: errorHandler_1.statusCode.conflict,
            };
        }
    }
    validationService.check_Email_Availability = check_Email_Availability;
    function form_Validation(form) {
        form.fields.forEach((field) => {
            if (!Object.values(form_1.inputType).includes(field.inputType)) {
                throw {
                    message: `Input type ${field.inputType} is not valid !`,
                    data: `valid types are ${Object.values(form_1.inputType)}`,
                    status: errorHandler_1.statusCode.badRequest,
                };
            }
        });
    }
    validationService.form_Validation = form_Validation;
    function validate_User_Belong_To_Organziation(user, organizationID) {
        if (!user.organization._id.equals(organizationID)) {
            throw {
                message: "You are not authorized to process !",
                status: errorHandler_1.statusCode.unauthorize,
                data: "Invlid action",
            };
        }
    }
    validationService.validate_User_Belong_To_Organziation = validate_User_Belong_To_Organziation;
    async function fields_Validation(field, form) {
        console.log(field);
        const Schema = (0, joi_1.generateSchema)(form);
        console.log(Schema);
        try {
            await Schema.validateAsync(field);
        }
        catch (err) {
            throw {
                message: "Failed to validate the form's fields",
                status: errorHandler_1.statusCode.badRequest,
                data: err,
            };
        }
    }
    validationService.fields_Validation = fields_Validation;
})(validationService = exports.validationService || (exports.validationService = {}));
//# sourceMappingURL=validation.service.js.map