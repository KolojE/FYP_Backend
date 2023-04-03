import { Document, model, Schema, Types } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";
import { ObjectId } from "mongodb";

interface Administrator extends Document {
    ID: string;
    User: {
        _id: Types.ObjectId;
        ID: string;
    },
}
const adminSchema = new Schema<Administrator>({
    ID: { type: String, unique: true, required: true },
    User: {
        _id: { type: Schema.Types.ObjectId, unique: true, ref: "User" },
        ID: { type: String, unique: true, ref: "User" }
    }
})
adminSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "administrator", prefix: "Admin_" });
const adminModel = model<Administrator>("Administrator", adminSchema);

export default adminModel;