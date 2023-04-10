
import { Document, model, Schema, Types } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";

interface IComplainant extends Document {
    ID: string;
    User: {
        _id: Types.ObjectId;
        ID: string;
    },
}


const complainantSchema = new Schema<IComplainant>({
    ID: { type: String, unique: true, required: true },
    User: {
        _id: { type: Schema.Types.ObjectId, unique: true, ref: "User" },
        ID: { type: String, unique: true, ref: "User" }
    }
})
complainantSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "Complainant", prefix: "Comp_" });
const complaiantModel = model<IComplainant>("Complainant", complainantSchema);

export default complaiantModel;