"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const detailsSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    inputType: { type: String, required: true },
    value: { type: mongoose_1.Schema.Types.Mixed, required: true },
});
const reportSchema = new mongoose_1.Schema({
    updateDate: { type: Date, required: true },
    submissionDate: { type: Date, required: true },
    details: {
        type: Map,
        of: detailsSchema,
        required: true
    },
    location: {
        latitude: { type: mongoose_1.Schema.Types.Number, required: true },
        longitude: { type: mongoose_1.Schema.Types.Number, required: true }
    },
    form: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "form" },
    organization: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "organization" },
    complainant: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "user" },
    status: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "status" },
    comment: {
        comment: { type: mongoose_1.Schema.Types.String, required: false },
        admin: { type: mongoose_1.Schema.Types.ObjectId, required: false, ref: "admin" }
    }
});
const ReportModel = (0, mongoose_1.model)('report', reportSchema);
exports.default = ReportModel;
//# sourceMappingURL=report.js.map