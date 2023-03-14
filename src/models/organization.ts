import {
    Schema, model, Model
} from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";

export interface Organization {
    _id: Schema.Types.ObjectId,
    ID: String,
    name: String,
    contactNo: String,
    address: String,
    passcode: String,
    creationDate: String

}

const organizationSchema = new Schema<Organization>({
    ID: { type: String, unique: true },
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    passcode: { type: String, required: true },
    creationDate: { type: Schema.Types.Date },
})

organizationSchema.plugin(autoIncrement, { fieldName: "ID" as keyof Organization, ModelName: "organization", prefix: "OR_" })


const OrganizationModel: Model<Organization> = model<Organization>('Organization', organizationSchema);
export default OrganizationModel;


