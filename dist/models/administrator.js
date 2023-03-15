"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.administratorModel = void 0;
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const administratorSchema = new mongoose_1.Schema({
    ID: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        hashed: { type: String, required: true },
        salt: { type: String, required: true },
    },
    organization: {
        _id: {
            type: mongoose_1.Schema.Types.ObjectId, required: true
        },
        ID: {
            type: String, required: true
        }
    }
});
administratorSchema.plugin(autoincrement_1.autoIncrement, { ModelName: "administrator", fieldName: "ID", prefix: "AM_" });
exports.administratorModel = (0, mongoose_1.model)('Administrator', administratorSchema);
//# sourceMappingURL=administrator.js.map