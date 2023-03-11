"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const administratorSchema = new mongoose_1.Schema({
    admin_ID: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    admin_Password: { type: String, required: true },
    organization: { type: mongoose_1.Schema.Types.ObjectId }
});
const administratorModel = (0, mongoose_1.model)('Administrator', administratorSchema);
//# sourceMappingURL=administrator.js.map