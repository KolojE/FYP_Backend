import { Document, model, Schema, Types } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";

interface IAdministrator extends Document {
    ID: string;
    User: {
        _id: Types.ObjectId;
        ID: string;
    },
}
const adminSchema = new Schema<IAdministrator>({
    ID: { type: String, unique: true, required: true },
    User: {
        _id: { type: Schema.Types.ObjectId, unique: true, ref: "user" },
        ID: { type: String, unique: true, ref: "user" }
    }
})
adminSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "administrator", prefix: "Admin_" });
const adminModel = model<IAdministrator>("administrator", adminSchema);

export default adminModel;

