"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_Collection = exports.get_All_Organization = exports.insert_Organization = void 0;
const organization_1 = __importDefault(require("../models/organization"));
async function insert_Organization(req, res) {
    const newOrganization = req.body;
    const newOrganization_ = new organization_1.default({
        organizationID: newOrganization.organizationID,
        organizationName: newOrganization.organizationName,
        address: newOrganization.address,
        contactNo: newOrganization.contactNo,
        creationDate: newOrganization.createDate,
    });
    newOrganization_.save().then((resolved) => {
        console.log("New Organization is inserted in the database");
        res.status(200).json({
            message: "successfully inserted organization",
            isCompleted: true,
            Resolved: resolved,
        });
    }, (rejected) => {
        res.status(500).json({
            message: "failed to insert organization",
            isCompleted: false,
            error: rejected,
        });
    });
}
exports.insert_Organization = insert_Organization;
function get_All_Organization(req, res) {
    console.log("get all organization");
    const organization = organization_1.default.find();
    res.send(200);
}
exports.get_All_Organization = get_All_Organization;
function create_Collection(req, res) {
    console.log("creating collection");
    organization_1.default.createCollection().then((resolved) => {
        console.log(resolved.collectionName);
        console.log("Collection Organization is Created");
        res.sendStatus(200);
    }, (rejected) => {
        console.log("Creation of Collectiion Organization Being Rejected");
    });
}
exports.create_Collection = create_Collection;
//# sourceMappingURL=organization.controller.js.map