"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const administrator_1 = require("../models/administrator");
const organization_1 = __importDefault(require("../models/organization"));
const hash_1 = require("../utils/hash");
const validation_service_1 = require("./validation.service");
var OrganizationService;
(function (OrganizationService) {
    async function create_New_Organization(data) {
        const newOrganization = data;
        const newOrganization_ = new organization_1.default({
            name: newOrganization.name,
            address: newOrganization.address,
            contactNo: newOrganization.contactNo,
            passcode: newOrganization.passcode,
        });
        const result = newOrganization_.save();
        return result;
    }
    OrganizationService.create_New_Organization = create_New_Organization;
    async function create_Root_Admin(newOrganization, data) {
        const newRootAdmin = data.rootAdmin;
        const hashedPassword = await (0, hash_1.hashPassword)(newRootAdmin.password);
        validation_service_1.validationService.is_Email(newRootAdmin.email);
        const newRootAdmin_ = new administrator_1.administratorModel({
            email: newRootAdmin.email,
            organization: {
                _id: newOrganization._id,
                ID: newOrganization.ID
            },
            password: {
                hashed: hashedPassword.hashValue,
                salt: hashedPassword.salt,
            }
        });
        return await newRootAdmin_.save();
    }
    OrganizationService.create_Root_Admin = create_Root_Admin;
})(OrganizationService = exports.OrganizationService || (exports.OrganizationService = {}));
//# sourceMappingURL=organization.service.js.map