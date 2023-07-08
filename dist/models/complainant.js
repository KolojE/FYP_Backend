"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const complainantSchema = new mongoose_1.Schema({
    ID: { type: String, unique: true, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, unique: true, ref: "user" },
    activation: { type: Boolean },
});
complainantSchema.plugin(autoincrement_1.autoIncrement, { fieldName: "ID", ModelName: "complainant", prefix: "Comp_" });
const complaiantModel = (0, mongoose_1.model)("complainant", complainantSchema);
exports.default = complaiantModel;
//# sourceMappingURL=complainant.js.map