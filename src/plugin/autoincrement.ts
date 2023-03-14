import { model, Schema } from "mongoose";

interface Object {
    ModelName: string,
    fieldName: string,
    prefix: string
}

interface counter {
    collectionID: String,
    seq: number,
}
const counterSchema = new Schema<counter>({
    collectionID: { type: String, required: true, unique: true },
    seq: { type: Number, required: true }
})

const counterModel = model<counter>("counter", counterSchema);



export function autoIncrement(schema: Schema, options: Object) {

    schema.pre('save', function (next) {

        const doc = this;
        const collectionID: string = options.ModelName;
        try {
            counterModel.findOneAndUpdate({ collectionID: collectionID }, { $inc: { seq: 1 } }, { new: true }).then(async (counterDoc) => {
                if (counterDoc == null) {
                    const newCounter = new counterModel({ collectionID: options.ModelName, seq: 0 });
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
