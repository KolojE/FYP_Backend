import { Document, Mixed, Model, model, Schema, Types } from "mongoose";
import { inputType } from "./form";
import { any } from "joi";


interface IOrganization {
    _id: Types.ObjectId;
    ID: string;
}

interface IComplainant {

    _id: Types.ObjectId;
    ID: string;
}

interface IStatus {
    _id: Types.ObjectId;
    comment:string;
    admin?: {
        _id: Types.ObjectId;
        ID: string;
    }
}

export interface IDetails 
{
[key:string]:{
    label:string;
    inputType:inputType;
    value:any;
};
}

const detailsSchema = new Schema<IDetails>({
    label: { type: String, required: true },
    inputType: { type: String, required: true },
    value: { type:Schema.Types.Mixed, required: true },
  });


export interface IReport extends Document {
    submissionDate: Date;
    updateDate:Date;
    details: IDetails;
    form_id: Types.ObjectId;
    organization: IOrganization;
    complainant: IComplainant;
    status: IStatus;

}


const reportSchema = new Schema<IReport>({
    updateDate:{type:Date,required:true},
    submissionDate: { type: Date, required: true },
    details: { 
        type: Map,
        of: detailsSchema,
        required: true
    },
    form_id: { type: Schema.Types.ObjectId, required: true, ref: "Form" },
    organization: {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "Organization" },
        ID: { type: String, required: true }
    },
    complainant: {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        ID: { type: String, required: true }
    },
    status: {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "status" },
        comment:{type:Schema.Types.String,required:false},
        admin: {
            _id: { type: Schema.Types.ObjectId,  ref: "administrator" },
            ID: { type: String }
        }
    }
});

const ReportModel: Model<IReport> = model<IReport>('report', reportSchema);

export default ReportModel;
