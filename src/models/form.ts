import { model, Model, Schema, Document } from "mongoose";

export enum inputType {
    Text = "Text",
    Date = "Date",
    Time = "Time",
    DropDown = "DropDown",
    Map = "Map",
    Photo = "Photo",
}

export interface field {
    label: String,
    inputType: inputType,
    options?: Array<any>,
    required: boolean
}

export interface Form extends Document {
    name: Schema.Types.String,
    fields: Array<field>,
    organization: {
        _id: Schema.Types.ObjectId,
        ID: String,
    },
    activation_Status: boolean,
    creationDate: Schema.Types.Date,
}

const formSchema = new Schema<Form>({
    name: { type: Schema.Types.String, required: true },
    fields: [
        { label: String, inputType: String, options: Schema.Types.Array, required: Boolean, type: Object }
    ]
    ,
    organization: {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "organizations" },
        ID: { type: String, required: true, ref: "organizations" },
    },
    creationDate: { type: Schema.Types.Date },
    activation_Status: { type: Schema.Types.Boolean, required: true },
})

export const formModel: Model<Form> = model<Form>("Form", formSchema)

