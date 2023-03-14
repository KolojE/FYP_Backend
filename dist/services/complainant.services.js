"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.complainantService = void 0;
const complainant_1 = __importDefault(require("../models/complainant"));
const organization_1 = __importDefault(require("../models/organization"));
const hash_1 = require("../utils/hash");
var complainantService;
(function (complainantService) {
    async function register_Complainant(complainantData) {
        const newComplainant = complainantData;
        console.log(newComplainant.profile);
        const Organization = await organization_1.default.findOne({ ID: newComplainant.organization.ID });
        if (!Organization) {
            throw {
                message: "ID " + newComplainant.organization.ID + " Organization Not Found! ",
                status: 500
            };
        }
        const hashedPassword = await (0, hash_1.hashPassword)(newComplainant.password);
        const newComplainant_ = new complainant_1.default({
            email: newComplainant.email,
            password: hashedPassword.hashValue,
            organization: { _id: Organization._id, ID: Organization.ID },
            passwordSalt: hashedPassword.salt,
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