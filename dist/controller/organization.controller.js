"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollectionController = exports.registerOrganizationController = void 0;
const organization_1 = __importDefault(require("../models/organization"));
const organization_service_1 = require("../services/organization.service");
async function registerOrganizationController(req, res, next) {
    try {
        const organization = req.body;
        const rootAdmin = req.body.rootAdmin;
        const newOrganization = await organization_service_1.OrganizationService.create_New_Organization(organization);
        await newOrganization.save();
        const newRootAdmin = await organization_service_1.OrganizationService.create_Root_Admin(newOrganization, rootAdmin);
        await newRootAdmin.save();
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
exports.registerOrganizationController = registerOrganizationController;
function createCollectionController(req, res) {
    organization_1.default.createCollection().then((resolved) => {
        res.status(200).json({
            message: "Organization Collection is created, This doesnt have to be done manually since moongose will handle the creation.",
            resolved: resolved
        }).send();
    }, (rejected) => {
        res.status(500).json({
            message: "Creation failed, Please see the error for details",
            erro: rejected
        }).send();
    });
}
exports.createCollectionController = createCollectionController;
//# sourceMappingURL=organization.controller.js.map