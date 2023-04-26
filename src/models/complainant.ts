
import { Document, model, Schema, Types } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";
import { boolean } from "joi";

export interface IComplainant extends Document {
    ID: string;
    user: {
        _id: Types.ObjectId;
        ID: string;
    },
    activation:boolean
    
}


const complainantSchema = new Schema<IComplainant>({
    ID: { type: String, unique: true, required: true },
    user: {
        _id: { type: Schema.Types.ObjectId, unique: true, ref: "user" },
        ID: { type: String, unique: true, ref: "user" }
    },
    activation:{type:Boolean},
})
complainantSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "Complainant", prefix: "Comp_" });
const complaiantModel = model<IComplainant>("Complainant", complainantSchema);

export default complaiantModel;