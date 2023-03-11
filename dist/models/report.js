"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    report_ID: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    report_Date: { type: mongoose_1.Schema.Types.Date, required: true },
    report_Status: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    complainant: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    organization: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    form: { type: mongoose_1.Schema.Types.ObjectId, required: true }
});
const reportModel = (0, mongoose_1.model)('Report', reportSchema);
//# sourceMappingURL=report.js.map