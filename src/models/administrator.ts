import { Model, model, Schema } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";



export interface Administrator {
    ID: string,
    email: string,
    password: {
        hashed: string,
        salt: string,
    },
    organization: {
        _id: Schema.Types.ObjectId,
        ID: string,
    },
}


const administratorSchema = new Schema<Administrator>({
    ID: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        hashed: { type: String, required: true },
        salt: { type: String, required: true },
    },
    organization: {
        _id: {
            type: Schema.Types.ObjectId, required: true
        },
        ID: {
            type: String, required: true
        }
    }
});

administratorSchema.plugin(autoIncrement, { ModelName: "administrator", fieldName: "ID", prefix: "AM_" })
export const administratorModel: Model<Administrator> = model<Administrator>('Administrator', administratorSchema);