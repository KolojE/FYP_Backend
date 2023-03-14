"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const administratorSchema = new mongoose_1.Schema({
    adminID: { type: String, unique: true },
    adminPassword: { type: String, required: true },
    organization: { type: mongoose_1.Schema.Types.ObjectId }
});
administratorSchema.plugin(autoincrement_1.autoIncrement, { ModelName: "administrtor", fieldName: "adminID", prefix: "AM_" });
const administratorModel = (0, mongoose_1.model)('Administrator', administratorSchema);
//# sourceMappingURL=administrator.js.map