import { Model, model, Schema, Types } from "mongoose";

interface Report {
    date: Date;
    status: boolean;
    details: object[];
    form: Types.ObjectId;
    organization: {
        _id: Types.ObjectId;
        ID: string;
    };
    complainant: {
        _id: Types.ObjectId;
        ID: string;
    };
}

const reportSchema = new Schema<Report>({
    date: { type: Date, required: true },
    status: { type: Boolean, required: true },
    details: { type: [Object], default: [] },
    form: { type: Schema.Types.ObjectId, required: true, ref: "Form" },
    organization: {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "Organization" },
        ID: { type: String, required: true }
    },
    complainant: {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        ID: { type: String, required: true }
    }
});

const ReportModel: Model<Report> = model<Report>('Report', reportSchema);

export { Report, ReportModel };
