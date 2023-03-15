"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_Collection = exports.register_Organization = void 0;
const organization_1 = __importDefault(require("../models/organization"));
const organization_service_1 = require("../services/organization.service");
async function register_Organization(req, res, next) {
    console.log(req.body);
    try {
        console.log("Creating new organization");
        const newOrganization = await organization_service_1.OrganizationService.create_New_Organization(req.body);
        console.log("Creating Root Admin");
        const newRootAdmin = await organization_service_1.OrganizationService.create_Root_Admin(newOrganization, req.body);
        res.status(200).json({
            message: "successfully inserted organization and root admin is created",
            isCompleted: true,
            resolve: {
                organization: {
                    ID: newOrganization.ID,
                    Name: newOrganization.name,
                },
                rootAdmin: {
                    ID: newRootAdmin.ID,
                    email: newRootAdmin.email,
                }
            },
        }).send();
    }
    catch (err) {
        next(err);
    }
}
exports.register_Organization = register_Organization;
function create_Collection(req, res) {
    organization_1.default.createCollection().then((resolved) => {
        res.status(200).json({
            message: "Organization Collection Is Created, This doesnt have to be done manually since moongose will handle the creation.",
            resolved: resolved
        }).send();
    }, (rejected) => {
        res.status(500).json({
            message: "Creation failed, Please see the error for details",
            erro: rejected
        }).send();
    });
}
exports.create_Collection = create_Collection;
//# sourceMappingURL=organization.controller.js.map