"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationService = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const form_1 = require("../models/form");
const user_1 = __importDefault(require("../models/user"));
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
    function form_validation(form) {
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
    validationService.form_validation = form_validation;
})(validationService = exports.validationService || (exports.validationService = {}));
//# sourceMappingURL=validation.service.js.map