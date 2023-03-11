"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const complainantSchema = new mongoose_1.Schema({
    complainant_ID: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    complainant_Email: { type: String, required: true },
    complainant_Password: { type: String, required: true },
    complainant_Profile: { type: String, required: true },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization'
    }
});
const complainantModel = (0, mongoose_1.model)('Complainant', complainantSchema);
exports.default = complainantModel;
//# sourceMappingURL=complainant.js.map