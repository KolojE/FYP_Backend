import { Model, model, Schema } from "mongoose";

interface Report {
    report_ID: Schema.Types.ObjectId,
    report_Date: Schema.Types.Date,
    report_Status: Schema.Types.ObjectId,
    complainant: Schema.Types.ObjectId,
    organization: Schema.Types.ObjectId,
    form: Schema.Types.ObjectId,
}

const reportSchema = new Schema<Report>({
    report_ID: { type: Schema.Types.ObjectId, required: true },
    report_Date: { type: Schema.Types.Date, required: true },
    report_Status: { type: Schema.Types.ObjectId, required: true },
    complainant: { type: Schema.Types.ObjectId, required: true },
    organization: { type: Schema.Types.ObjectId, required: true },
    form: { type: Schema.Types.ObjectId, required: true }
})


const reportModel: Model<Report> = model<Report>('Report', reportSchema);