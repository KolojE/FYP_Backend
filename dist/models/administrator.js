"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const adminSchema = new mongoose_1.Schema({
    ID: { type: String, unique: true, required: true },
    user: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, unique: true, ref: "user" },
        ID: { type: String, unique: true, ref: "user" }
    }
});
adminSchema.plugin(autoincrement_1.autoIncrement, { fieldName: "ID", ModelName: "administrator", prefix: "Admin_" });
const adminModel = (0, mongoose_1.model)("administrator", adminSchema);
exports.default = adminModel;
//# sourceMappingURL=administrator.js.map