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
exports.OrganizationService = void 0;
const organization_1 = __importDefault(require("../models/organization"));
const hash_1 = require("../utils/hash");
const validation_service_1 = require("./validation.service");
const user_1 = __importStar(require("../models/user"));
const status_1 = __importDefault(require("../models/status"));
var OrganizationService;
(function (OrganizationService) {
    async function create_New_Organization(data) {
        const newOrganization = data;
        await validation_service_1.validationService.check_Email_Availability(newOrganization.rootAdmin.email);
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
        const newAdminUser = new user_1.default({
            email: newRootAdmin.email,
            organization: {
                _id: newOrganization._id,
                ID: newOrganization.ID
            },
            password: {
                hashed: hashedPassword.hashValue,
                salt: hashedPassword.salt,
            },
            role: user_1.role.admin,
        });
        return await newAdminUser.save();
    }
    OrganizationService.create_Root_Admin = create_Root_Admin;
    async function create_default_status(next) {
        const doc = this;
        const pendingStatus = new status_1.default({
            desc: "Pending",
            organization: {
                _id: doc._id,
                ID: doc.ID,
            },
        });
        const resolvedStatus = new status_1.default({
            desc: "Resolved",
            organization: {
                _id: doc._id,
                ID: doc.ID,
            }
        });
        const systemDefaultStatus = await pendingStatus.save();
        await resolvedStatus.save();
        doc.defaultStatus = pendingStatus._id;
        next();
    }
    OrganizationService.create_default_status = create_default_status;
})(OrganizationService = exports.OrganizationService || (exports.OrganizationService = {}));
//# sourceMappingURL=organization.service.js.map