import { Document, Model, model, Schema, Types } from "mongoose";


interface organization {
    _id: Types.ObjectId;
    ID: string;
}

interface complainant {

    _id: Types.ObjectId;
    ID: string;
}

interface status {
    _id: Types.ObjectId;
    admin?: {
        _id: Types.ObjectId;
        ID: string;
    }
}

export interface Report extends Document {
    date: Date;
    details: object[];
    form: Types.ObjectId;
    ReportStatus: status;
    organization: organization;
    complainant: complainant;
    status: status;

}

const reportSchema = new Schema<Report>({
    date: { type: Date, required: true },
    details: { type: [Object] },
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

const ReportModel: Model<Report> = model<Report>('Report', reportSchema);

export default ReportModel;
