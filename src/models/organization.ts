import {
    Schema, model, Model, Document
} from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";

interface Organization {
    organizationID: String,
    organizationName: String,
    contactNo: String,
    address: String,
    asd: String,

}

const organizationSchema = new Schema<Organization>({
    organizationID: { type: String, unique: true },
    organizationName: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
})

organizationSchema.plugin(autoIncrement, { fieldName: "organizationID", ModelName: "organization", prefix: "OR_" })

const OrganizationModel: Model<Organization> = model<Organization>('Organization', organizationSchema);
export default OrganizationModel;


