import { Model, model, Schema } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";



interface Administrator {
    adminID: String,
    adminPassword: string,
    organization: Schema.Types.ObjectId,
}


const administratorSchema = new Schema<Administrator>({
    adminID: { type: String, unique: true },
    adminPassword: { type: String, required: true },
    organization: { type: Schema.Types.ObjectId }
});

administratorSchema.plugin(autoIncrement, { ModelName: "administrtor", fieldName: "adminID" as keyof Administrator, prefix: "AM_" })

const administratorModel: Model<Administrator> = model<Administrator>('Administrator', administratorSchema);