"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formSchemaModel = void 0;
const mongoose_1 = require("mongoose");
const formSchema = new mongoose_1.Schema({
    form_ID: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    form_Name: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    form_Details: { type: [Object], required: true },
});
exports.formSchemaModel = (0, mongoose_1.model)("Form", formSchema);
//# sourceMappingURL=form.js.map