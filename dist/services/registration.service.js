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
exports.registrationService = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const organization_1 = __importDefault(require("../models/organization"));
const user_1 = __importStar(require("../models/user"));
const hash_1 = require("../utils/hash");
const validation_service_1 = require("./validation.service");
var registrationService;
(function (registrationService) {
    async function register_Complainant(complainantData) {
        const newComplainant = complainantData;
        console.log(newComplainant);
        newComplainant.email = newComplainant.email.toLowerCase();
        const Organization = await organization_1.default.findOne({ ID: newComplainant.organization.ID });
        await validation_service_1.validationService.check_Email_Availability(newComplainant.email);
        if (!Organization) {
            throw new errorHandler_1.clientError({
                message: "ID " + newComplainant.organization.ID + " Organization Not Found! ",
                status: errorHandler_1.statusCode.notfound
            });
        }
        if (!validation_service_1.validationService.is_Email(newComplainant.email)) {
            throw new errorHandler_1.clientError({
                message: "Identifier is not an email !",
                status: errorHandler_1.statusCode.badRequest
            });
        }
        const hashedPassword = await (0, hash_1.hashPassword)(newComplainant.password.toString());
        const newComplainant_ = new user_1.default({
            email: newComplainant.email,
            name: newComplainant.name,
            password: {
                hashed: hashedPassword.hashed,
                salt: hashedPassword.salt,
            },
            organization: { _id: Organization._id, ID: Organization.ID },
            role: user_1.role.complainant,
        });
        return newComplainant_.save();
    }
    registrationService.register_Complainant = register_Complainant;
})(registrationService = exports.registrationService || (exports.registrationService = {}));
//# sourceMappingURL=registration.service.js.map