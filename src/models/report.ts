import { Document, Model, model, Schema, Types } from "mongoose";


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
    admin?: {
        _id: Types.ObjectId;
        ID: string;
    }
}

export interface IReport extends Document {
    submissionDate: Date;
    updateDate:Date;
    details: object;
    form: Types.ObjectId;
    organization: IOrganization;
    complainant: IComplainant;
    status: IStatus;

}

const reportSchema = new Schema<IReport>({
    updateDate:{type:Date,required:true},
    submissionDate: { type: Date, required: true },
    details: { type: Object ,required:true },
    form: { type: Schema.Types.ObjectId, required: true, ref: "Form" },
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
        admin: {
            _id: { type: Schema.Types.ObjectId,  ref: "administrator" },
            ID: { type: String }
        }
    }
});

const ReportModel: Model<IReport> = model<IReport>('report', reportSchema);

export default ReportModel;
