"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.complainantService = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const complainant_1 = __importDefault(require("../models/complainant"));
const organization_1 = __importDefault(require("../models/organization"));
const hash_1 = require("../utils/hash");
const validation_service_1 = require("./validation.service");
var complainantService;
(function (complainantService) {
    async function register_Complainant(complainantData) {
        const newComplainant = complainantData;
        const Organization = await organization_1.default.findOne({ ID: newComplainant.organization.ID });
        await validation_service_1.validationService.check_Email_Availability(newComplainant.email);
        if (!Organization) {
            throw {
                message: "ID " + newComplainant.organization.ID + " Organization Not Found! ",
                status: errorHandler_1.statusCode.conflict
            };
        }
        if (!validation_service_1.validationService.is_Email(newComplainant.email)) {
            throw {
                message: "Identifier is not an email !",
                status: errorHandler_1.statusCode.badRequest
            };
        }
        const hashedPassword = await (0, hash_1.hashPassword)(newComplainant.password);
        const newComplainant_ = new complainant_1.default({
            email: newComplainant.email,
            password: {
                hashed: hashedPassword.hashValue,
                salt: hashedPassword.salt
            },
            organization: { _id: Organization._id, ID: Organization.ID },
            profile: {
                username: newComplainant.profile.username,
                contact: newComplainant.profile.contactNo,
            }
        });
        return newComplainant_.save();
    }
    complainantService.register_Complainant = register_Complainant;
})(complainantService = exports.complainantService || (exports.complainantService = {}));
//# sourceMappingURL=complainant.services.js.map