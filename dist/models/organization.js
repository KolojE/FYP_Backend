"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const organizationSchema = new mongoose_1.Schema({
    ID: { type: String, unique: true },
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    passcode: { type: String, required: true },
    creationDate: { type: mongoose_1.Schema.Types.Date },
});
organizationSchema.plugin(autoincrement_1.autoIncrement, { fieldName: "ID", ModelName: "organization", prefix: "OR_" });
const OrganizationModel = (0, mongoose_1.model)('Organization', organizationSchema);
exports.default = OrganizationModel;
//# sourceMappingURL=organization.js.map