"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    details: { type: [Object] },
    form: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Form" },
    organization: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Organization" },
        ID: { type: String, required: true }
    },
    complainant: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
        ID: { type: String, required: true }
    },
    status: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "status" },
        admin: {
            _id: { type: mongoose_1.Schema.Types.ObjectId, ref: "administrator" },
            ID: { type: String }
        }
    }
});
const ReportModel = (0, mongoose_1.model)('report', reportSchema);
exports.default = ReportModel;
//# sourceMappingURL=report.js.map