import { Model, model, Schema } from "mongoose";



interface Administrator {
    admin_ID: Schema.Types.ObjectId,
    admin_Password: string,
    organization: Schema.Types.ObjectId,
}

const administratorSchema = new Schema<Administrator>({
    admin_ID: { type: Schema.Types.ObjectId, required: true },
    admin_Password: { type: String, required: true },
    organization: { type: Schema.Types.ObjectId }
});

const administratorModel: Model<Administrator> = model<Administrator>('Administrator', administratorSchema);