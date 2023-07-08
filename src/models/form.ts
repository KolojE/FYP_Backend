import { model, Model, Schema, Document, Types } from "mongoose";
import { administratorService } from "../services/administrator.service";

export enum inputType {
    Text = "Text",
    Date = "Date",
    Time = "Time",
    DropDown = "DropDown",
    Map = "Map",
    Photo = "Photo",
    Video="Video"
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

export interface IForm extends Document {
    name: string;
    defaultFields:Array<IField>;
    fields: Array<IField>;
    organization: Types.ObjectId;
    icon:string;
    color: string;
    creationDate: Date;
    isDeleted: boolean;
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
    organization:{ type: Schema.Types.ObjectId, required: true, ref: "organizations" },
    icon: { type: Schema.Types.String, required: false},
    color: { type: Schema.Types.String, required: true },
    creationDate: { type: Schema.Types.Date,required:true },
    isDeleted: { type: Schema.Types.Boolean, required: true, default: false },
})

export const FormModel: Model<IForm> = model<IForm>("form", formSchema)


