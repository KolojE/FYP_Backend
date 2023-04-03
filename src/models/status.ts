import { Schema, Types, model } from "mongoose"

interface Organization {
    _id: Types.ObjectId;
    ID: string;
}
export interface Status {
    desc: string;
    organization: Organization;
}



const statusSchema = new Schema<Status>(
    {
        desc: { type: String, required: true },
        organization:
        {
            _id: { type: Schema.Types.ObjectId, required: true },
            ID: { type: Schema.Types.String, required: true },
        }
    }
)

const statusModel = model<Status>("status", statusSchema);

export default statusModel;

