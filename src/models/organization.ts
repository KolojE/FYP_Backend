import { Document, Types } from "mongoose";
import {
    Schema, model, Model
} from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";
import { OrganizationService } from "../services/organization.service";



export interface IOrganization extends Document {
    _id: Types.ObjectId;
    ID: string;
    name: string;
    contactNo: string;
    address: string;
    creationDate: Date;
    defaultStatus: Types.ObjectId;

}

const organizationSchema = new Schema<IOrganization>({
    ID: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    creationDate: { type: Schema.Types.Date,required:true },
    defaultStatus: { type: Schema.Types.ObjectId, required: true },

})

organizationSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "organization", prefix: "OR_" });
organizationSchema.pre("validate", OrganizationService.create_default_status);


const OrganizationModel: Model<IOrganization> = model<IOrganization>('Organization', organizationSchema);
export default OrganizationModel;


