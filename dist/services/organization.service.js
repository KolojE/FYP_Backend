"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const organization_1 = __importDefault(require("../models/organization"));
var OrganizationService;
(function (OrganizationService) {
    async function create_New_Organization(data) {
        const newOrganization = data;
        console.log(newOrganization);
        try {
            const newOrganization_ = new organization_1.default({
                name: newOrganization.name,
                address: newOrganization.address,
                contactNo: newOrganization.contactNo,
                passcode: newOrganization.passcode,
            });
            return await newOrganization_.save();
        }
        catch (err) {
            throw err;
        }
    }
    OrganizationService.create_New_Organization = create_New_Organization;
    async function get_All_Organizations() {
        const organizations = await organization_1.default.find().exec();
        return organizations;
    }
    OrganizationService.get_All_Organizations = get_All_Organizations;
})(OrganizationService = exports.OrganizationService || (exports.OrganizationService = {}));
//# sourceMappingURL=organization.service.js.map