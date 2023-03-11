import { model, Model, Schema } from "mongoose";

interface form {
    form_ID: Schema.Types.ObjectId,
    form_Name: Schema.Types.String,
    form_Details: [Object],
    organization: Schema.Types.ObjectId,
    Activation_Status: boolean,
}

const formSchema = new Schema<form>(
    {
        form_ID: { type: Schema.Types.ObjectId, required: true },
        form_Name: { type: Schema.Types.ObjectId, required: true },
        form_Details: { type: [Object], required: true },

    })
export const formSchemaModel: Model<form> = model<form>("Form", formSchema)

