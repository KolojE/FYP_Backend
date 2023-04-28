import { model, Model, Schema, Document, Types } from "mongoose";
import { administratorService } from "../services/administrator.service";

export enum inputType {
    Text = "Text",
    Date = "Date",
    Time = "Time",
    DropDown = "DropDown",
    Map = "Map",
    Photo = "Photo",
}

export interface IField {
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
export interface IForm extends Document {
    name: string;
    defaultFields:Array<IField>;
    fields: Array<IField>;
    organization: {
        _id: Types.ObjectId;
        ID: String;
    },
    activation_Status: boolean;
    creationDate: Date;
}

const formSchema = new Schema<IForm>({
    name: { type: Schema.Types.String, required: true },
    defaultFields:[
        { label: String, inputType: String, options: Schema.Types.Array, required: Boolean, type: fieldSchema}
    ],
    fields: [
        { label: String, inputType: String, options: Schema.Types.Array, required: Boolean, type: fieldSchema }
    ]
    ,
    organization: {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "organizations" },
        ID: { type: String, required: true, ref: "organizations" },
    },
    creationDate: { type: Schema.Types.Date,required:true },
    activation_Status: { type: Schema.Types.Boolean, required: true },
})

formSchema.pre('save',administratorService.preFormSave)
export const FormModel: Model<IForm> = model<IForm>("form", formSchema)


