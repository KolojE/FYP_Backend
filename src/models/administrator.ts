import { Document, model, Schema } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";

interface Administrator extends Document {
    ID: string,
    User: {
        _id: Schema.Types.ObjectId,
        ID: string,
    },
}
const adminSchema = new Schema<Administrator>({
    ID: { type: String, unique: true },
    User: {
        _id: { type: String, unique: true, ref: "User" },
        ID: { type: String, unique: true, ref: "User" }
    }
})
adminSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "administrator", prefix: "Admin_" });
const adminModel = model<Administrator>("Administrator", adminSchema);

export default adminModel;