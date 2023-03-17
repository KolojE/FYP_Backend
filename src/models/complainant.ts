
import { Document, model, Schema } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";

interface Complainant extends Document {
    ID: string,
    User: {
        _id: Schema.Types.ObjectId,
        ID: string,
    },
}


const complainantSchema = new Schema<Complainant>({
    ID: { type: String, unique: true },
    User: {
        _id: { type: String, unique: true, ref: "User" },
        ID: { type: String, unique: true, ref: "User" }
    }
})
complainantSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "Complainant", prefix: "Comp_" });
const complaiantModel = model<Complainant>("Complainant", complainantSchema);

export default complaiantModel;