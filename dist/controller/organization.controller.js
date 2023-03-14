"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_Collection = exports.get_All_Organizations = exports.register_Organization = void 0;
const organization_1 = __importDefault(require("../models/organization"));
const organization_service_1 = require("../services/organization.service");
async function register_Organization(req, res) {
    console.log(req.body);
    try {
        const result = await organization_service_1.OrganizationService.create_New_Organization(req.body);
        console.log("New Organization is inserted in the database");
        res.status(200).json({
            message: "successfully inserted organization",
            isCompleted: true,
            resolved: result,
        }).send();
    }
    catch (error) {
        res.status(500).json({
            message: "failed to insert organization",
            isCompleted: false,
            error: error,
        });
    }
}
exports.register_Organization = register_Organization;
async function get_All_Organizations(req, res) {
    console.log("get all organization");
    try {
        const result = organization_service_1.OrganizationService.get_All_Organizations();
        res.status(200).json({
            message: "Sucessfully returned all organization",
            isCompleted: true,
            resolved: result
        }).send();
    }
    catch (error) {
        res.status(500).json({
            message: "Sucessfully returned all organization",
            isCompleted: true,
            errir: error
        }).send();
    }
}
exports.get_All_Organizations = get_All_Organizations;
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