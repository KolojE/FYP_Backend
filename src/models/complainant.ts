import { Schema, model, Model } from "mongoose"
import { autoIncrement } from "../plugin/autoincrement";

export interface Complainant {
    ID: string,
    email: string,
    password: {
        hashed: string,
        salt: string,
    },
    profile: {
        username: string,
        contact?: string,
    },
    organization: {
        _id: Schema.Types.ObjectId,
        ID: String,
    }

}

const complainantSchema = new Schema<Complainant>({
    ID: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        hash: { type: String, required: true },
        passwordSalt: { type: String, required: true }
    },
    profile: {
        username: {
            type: String, required: true
        },
        contact: {
            type: String
        }
    },
    organization: {
        _id: { type: Schema.Types.ObjectId, require: true },
        ID: { type: String, required: true }
    },
});

complainantSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "complainant", prefix: "CP_" })

const complainantModel: Model<Complainant> = model<Complainant>('Complainant', complainantSchema)

export default complainantModel;