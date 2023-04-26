"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const complainantSchema = new mongoose_1.Schema({
    ID: { type: String, unique: true, required: true },
    user: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, unique: true, ref: "user" },
        ID: { type: String, unique: true, ref: "user" }
    },
    activation: { type: Boolean },
});
complainantSchema.plugin(autoincrement_1.autoIncrement, { fieldName: "ID", ModelName: "Complainant", prefix: "Comp_" });
const complaiantModel = (0, mongoose_1.model)("Complainant", complainantSchema);
exports.default = complaiantModel;
//# sourceMappingURL=complainant.js.map