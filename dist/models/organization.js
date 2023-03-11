"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const organizationSchema = new mongoose_1.Schema({
    organizationID: { type: String, unique: true },
    organizationName: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
});
organizationSchema.plugin(autoincrement_1.autoIncrement, { fieldName: "organizationID", ModelName: "organization", prefix: "OR_" });
const OrganizationModel = (0, mongoose_1.model)('Organization', organizationSchema);
exports.default = OrganizationModel;
//# sourceMappingURL=organization.js.map