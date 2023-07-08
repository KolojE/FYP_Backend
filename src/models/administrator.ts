import { Document, model, Schema, Types } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";

interface IAdministrator extends Document {
    ID: string;
    user:Types.ObjectId;
}
const adminSchema = new Schema<IAdministrator>({
    ID: { type: String, unique: true, required: true },
    user: { type: Schema.Types.ObjectId, unique: true, ref: "user" },
    
})
adminSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "administrator", prefix: "Admin_" });
const adminModel = model<IAdministrator>("administrator", adminSchema);

export default adminModel;

