"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.role = void 0;
const mongoose_1 = require("mongoose");
const autoincrement_1 = require("../plugin/autoincrement");
const user_service_1 = require("../services/user.service");
var role;
(function (role) {
    role["admin"] = "admin";
    role["complainant"] = "complainant";
})(role = exports.role || (exports.role = {}));
const userSchema = new mongoose_1.Schema({
    ID: { type: String, unique: true },
    email: { type: mongoose_1.Schema.Types.String, unique: true, required: true },
    profilePicture: { type: mongoose_1.Schema.Types.String, required: false },
    name: { type: mongoose_1.Schema.Types.String, required: true },
    password: {
        hashed: { type: String, required: true },
        salt: { type: String, required: true },
    },
    organization: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "organization" },
        ID: { type: String, required: true, ref: "organization" },
    },
    contact: {
        phoneNo: { type: String, required: false },
        address: { type: String },
    },
    role: { type: String, enum: ["complainant", "admin"], required: true },
});
userSchema.plugin(autoincrement_1.autoIncrement, { fieldName: "ID", ModelName: "user", prefix: "UR_" });
userSchema.post('save', user_service_1.userService.create_role);
userSchema.post("findOneAndDelete", user_service_1.userService.delete_role);
const userModel = (0, mongoose_1.model)("user", userSchema);
exports.default = userModel;
//# sourceMappingURL=user.js.map