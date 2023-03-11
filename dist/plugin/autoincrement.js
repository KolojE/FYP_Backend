"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoIncrement = void 0;
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    seq: { type: Number, required: true }
}, { _id: false });
const counterModel = (0, mongoose_1.model)("counter", counterSchema);
function autoIncrement(schema, options) {
    schema.pre('save', function (next) {
        const doc = this;
        const counterID = options.ModelName;
        console.log(counterID);
        try {
            counterModel.findByIdAndUpdate(counterID, { $inc: { seq: 1 } }, { new: true }).then(async (counterDoc) => {
                var _a;
                if (counterDoc == null) {
                    const newCounter = new counterModel({ _id: options.ModelName, seq: 0 });
                    await newCounter.save();
                }
                doc[options.fieldName] = getID((_a = counterDoc === null || counterDoc === void 0 ? void 0 : counterDoc.seq) !== null && _a !== void 0 ? _a : 0, options.prefix);
                next();
            }, (rejected) => {
                console.log(rejected);
                next(rejected);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.autoIncrement = autoIncrement;
function getID(currentSeq, prefix) {
    const seq = currentSeq;
    const ID = prefix + seq;
    console.log(ID);
    return ID;
}
//# sourceMappingURL=autoincrement.js.map