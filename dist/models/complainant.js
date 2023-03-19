"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const complainantSchema = new mongoose_1.Schema({
    ID: { type: String, unique: true },
    User: {
        _id: { type: String, unique: true, ref: "User" },
        ID: { type: String, unique: true, ref: "User" }
    }
});
complainantSchema.plugin(autoincrement_1.autoIncrement, { fieldName: "ID", ModelName: "Complainant", prefix: "Comp_" });
const complaiantModel = (0, mongoose_1.model)("Complainant", complainantSchema);
exports.default = complaiantModel;
//# sourceMappingURL=complainant.js.map