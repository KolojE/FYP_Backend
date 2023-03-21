import { model, Model, Schema, Document } from "mongoose";


export interface form extends Document {
    name: Schema.Types.String,
    fields: Schema.Types.Array,
    organization: {
        _id: Schema.Types.ObjectId,
        ID: String,
    },
    activation_Status: boolean,
    creationDate: Schema.Types.Date,
}

const formSchema = new Schema<form>(
    {
        name: { type: Schema.Types.String, required: true },
        fields: { type: Schema.Types.Array, required: true },
        organization: {
            _id: { type: Schema.Types.ObjectId, required: true, ref: "organizations" },
            ID: { type: String, required: true, ref: "organizations" },
        },
        creationDate: { type: Schema.Types.Date },
        activation_Status: { type: Schema.Types.Boolean, required: true },

    })

export const formModel: Model<form> = model<form>("Form", formSchema)

