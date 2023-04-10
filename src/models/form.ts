import { model, Model, Schema, Document, Types } from "mongoose";

export enum inputType {
    Text = "Text",
    Date = "Date",
    Time = "Time",
    DropDown = "DropDown",
    Map = "Map",
    Photo = "Photo",
}

export interface IField extends Document {
    label: string,
    inputType: inputType,
    options?: Array<any>,
    required: boolean
}

const fieldSchema = new Schema<IField>(
    {
        label: { type: String, required: true },
        inputType: { type: String, required: true },
        options: { type: Array },
        required: { type: Boolean, required: true },
    }
)

export interface Form extends Document {
    name: string;
    fields: Array<IField>;
    organization: {
        _id: Types.ObjectId;
        ID: String;
    },
    activation_Status: boolean;
    creationDate: Date;
}

const formSchema = new Schema<Form>({
    name: { type: Schema.Types.String, required: true },
    fields: [
        { label: String, inputType: String, options: Schema.Types.Array, required: Boolean, type: fieldSchema }
    ]
    ,
    organization: {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "organizations" },
        ID: { type: String, required: true, ref: "organizations" },
    },
    creationDate: { type: Schema.Types.Date },
    activation_Status: { type: Schema.Types.Boolean, required: true },
})

export const FormModel: Model<Form> = model<Form>("Form", formSchema)

