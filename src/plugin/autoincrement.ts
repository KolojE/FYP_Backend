import { Document, model, Schema } from "mongoose";
import { resolve } from "path";

interface Object {
    ModelName: string,
    fieldName: string,
    prefix: string
}

interface counter extends Document {
    _id: String,
    seq: number,
}
const counterSchema = new Schema<counter>({
    _id: { type: Schema.Types.ObjectId, required: true },
    seq: { type: Number, required: true }
}, { _id: false })

const counterModel = model<counter>("counter", counterSchema);


export function autoIncrement(schema: Schema, options: Object) {

    schema.pre('save', function (next) {
        const doc = this;
        const counterID: string = options.ModelName;
        console.log(counterID)
        try {
            counterModel.findByIdAndUpdate(counterID, { $inc: { seq: 1 } }, { new: true }).then(async (counterDoc) => {
                if (counterDoc == null) {
                    const newCounter = new counterModel({ _id: options.ModelName, seq: 0 });
                    await newCounter.save();
                }
                doc[options.fieldName] = getID(counterDoc?.seq ?? 0, options.prefix);
                next();
            }, (rejected) => {
                console.log(rejected);
                next(rejected);
            })
        } catch (err) {
            console.log(err);
        }
    })


}

function getID(currentSeq: number, prefix: string): string {
    const seq = currentSeq;
    const ID = prefix + seq;
    console.log(ID);
    return ID;
}
