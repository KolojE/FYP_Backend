"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const organization_service_1 = require("../services/organization.service");
const organizationSchema = new mongoose_1.Schema({
    ID: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    creationDate: { type: mongoose_1.Schema.Types.Date, required: true },
    defaultStatus: { type: mongoose_1.Schema.Types.ObjectId, required: true },
});
organizationSchema.plugin(autoincrement_1.autoIncrement, { fieldName: "ID", ModelName: "organization", prefix: "OR_" });
organizationSchema.pre("validate", organization_service_1.OrganizationService.create_default_status);
const OrganizationModel = (0, mongoose_1.model)('Organization', organizationSchema);
exports.default = OrganizationModel;
//# sourceMappingURL=organization.js.map