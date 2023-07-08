import { Document, Schema, Types, model } from "mongoose"

export interface Status extends Document{
    _id: Types.ObjectId;
    desc: string;
    organization: Types.ObjectId;
}

const statusSchema = new Schema<Status>(
    {
        desc: { type: String, required: true },
        organization:{ type: Schema.Types.ObjectId, required: true, ref: "organization" },
    }
)

const statusModel = model<Status>("status", statusSchema);

export default statusModel;

