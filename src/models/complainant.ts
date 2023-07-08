
import { Document, model, Schema, Types } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";

export interface IComplainant extends Document {
    ID: string;
    user:Types.ObjectId;
    activation:boolean
    
}


const complainantSchema = new Schema<IComplainant>({
    ID: { type: String, unique: true, required: true },
    user:{ type: Schema.Types.ObjectId, unique: true, ref: "user" },
    activation:{type:Boolean},
})
complainantSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "complainant", prefix: "Comp_" });
const complaiantModel = model<IComplainant>("complainant", complainantSchema);

export default complaiantModel;