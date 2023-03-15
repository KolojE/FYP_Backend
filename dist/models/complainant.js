"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const complainantSchema = new mongoose_1.Schema({
    ID: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        hash: { type: String, required: true },
        passwordSalt: { type: String, required: true }
    },
    profile: {
        username: {
            type: String, required: true
        },
        contact: {
            type: String
        }
    },
    organization: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, require: true },
        ID: { type: String, required: true }
    },
});
complainantSchema.plugin(autoincrement_1.autoIncrement, { fieldName: "ID", ModelName: "complainant", prefix: "CP_" });
const complainantModel = (0, mongoose_1.model)('Complainant', complainantSchema);
exports.default = complainantModel;
//# sourceMappingURL=complainant.js.map