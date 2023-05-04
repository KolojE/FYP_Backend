"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormModel = exports.inputType = void 0;
const mongoose_1 = require("mongoose");
var inputType;
(function (inputType) {
    inputType["Text"] = "Text";
    inputType["Date"] = "Date";
    inputType["Time"] = "Time";
    inputType["DropDown"] = "DropDown";
    inputType["Map"] = "Map";
    inputType["Photo"] = "Photo";
})(inputType = exports.inputType || (exports.inputType = {}));
const fieldSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    inputType: { type: String, required: true },
    options: { type: Array },
    required: { type: Boolean, required: true },
});
const formSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, required: true },
    defaultFields: [
        { label: String, inputType: String, options: mongoose_1.Schema.Types.Array, required: Boolean, type: fieldSchema }
    ],
    fields: [
        { label: String, inputType: String, options: mongoose_1.Schema.Types.Array, required: Boolean, type: fieldSchema }
    ],
    organization: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "organizations" },
        ID: { type: String, required: true, ref: "organizations" },
    },
    creationDate: { type: mongoose_1.Schema.Types.Date, required: true },
    activation_Status: { type: mongoose_1.Schema.Types.Boolean, required: true },
});
exports.FormModel = (0, mongoose_1.model)("form", formSchema);
//# sourceMappingURL=form.js.map