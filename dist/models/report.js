"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModel = void 0;
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    status: { type: Boolean, required: true },
    details: { type: [Object], default: [] },
    form: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Form" },
    organization: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Organization" },
        ID: { type: String, required: true }
    },
    complainant: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
        ID: { type: String, required: true }
    }
});
const ReportModel = (0, mongoose_1.model)('Report', reportSchema);
exports.ReportModel = ReportModel;
//# sourceMappingURL=report.js.map