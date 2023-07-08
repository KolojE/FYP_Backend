import { Document, Types } from "mongoose";
import {
    Schema, model, Model
} from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";
import { OrganizationService } from "../services/organization.service";



export interface ISystemConfig {
    autoActiveNewUser: boolean;
    defaultStatus?: Types.ObjectId;
}

const systemConfigSchema = new Schema<ISystemConfig>({
    autoActiveNewUser: { type: Boolean, required: true },
    defaultStatus: { type: Schema.Types.ObjectId, required: true, ref: "status" }
})

export interface IOrganization extends Document {
    ID: string;
    name: string;
    contactNo: string;
    address: string;
    creationDate: Date;
    system : ISystemConfig;
}



const organizationSchema = new Schema<IOrganization>({
    ID: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    creationDate: { type: Schema.Types.Date,required:true },
    system: { type: systemConfigSchema, required: true}
})

organizationSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "organization", prefix: "OR_" });
organizationSchema.pre("validate", OrganizationService.create_default_system_config);

const OrganizationModel: Model<IOrganization> = model<IOrganization>('organization', organizationSchema);
export default OrganizationModel;


