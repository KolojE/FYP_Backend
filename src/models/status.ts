import { Document, Schema, Types, model } from "mongoose"

interface Organization {
    _id: Types.ObjectId;
    ID: string;
}
export interface Status extends Document{
    desc: string;
    organization: Organization;
}

const statusSchema = new Schema<Status>(
    {
        desc: { type: String, required: true },
        organization:
        {
            _id: { type: Schema.Types.ObjectId, required: true, ref: "organization" },
            ID: { type: Schema.Types.String, required: true, ref: "organization" },
        }
    }
)

const statusModel = model<Status>("status", statusSchema);

export default statusModel;

