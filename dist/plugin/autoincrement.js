"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoIncrement = void 0;
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    collectionID: { type: String, required: true, unique: true },
    seq: { type: Number, required: true }
});
const counterModel = (0, mongoose_1.model)("counter", counterSchema);
function autoIncrement(schema, options) {
    schema.pre('validate', function (next) {
        const doc = this;
        const collectionID = options.ModelName;
        try {
            counterModel.findOneAndUpdate({ collectionID: collectionID }, { $inc: { seq: 1 } }, { new: true }).then(async (counterDoc) => {
                var _a;
                if (counterDoc == null) {
                    const newCounter = new counterModel({ collectionID: options.ModelName, seq: 0 });
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