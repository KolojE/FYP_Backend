"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_All_Organization = exports.insert_Organization = void 0;
const organization_1 = __importDefault(require("../models/organization"));
function insert_Organization(req, res) {
    const newOrganization = new organization_1.default({
        organization_ID: "",
        address: "",
        contactNo: "",
        Organization_Name: "",
    });
    newOrganization.save();
}
exports.insert_Organization = insert_Organization;
function get_All_Organization(req, res) {
    const organization = organization_1.default.find();
}
exports.get_All_Organization = get_All_Organization;
//# sourceMappingURL=OrganizationController.js.map