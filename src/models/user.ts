import { Document, model, Schema, Types } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";
import { userService } from "../services/user.service";

export enum role {
    admin = "admin",
    complainant = "complainant"
}
interface IOrganization {

    _id: Types.ObjectId;
    ID: string;
}
interface IContact {

    phoneNo: String;
    address: String;
}

interface IPassword {

        hashed: string;
        salt: string;
}

export interface IUser extends Document {
    ID: string;
    profilePicture?:string;
    email: string;
    name:string;
    password: IPassword;
    organization: IOrganization;
    contact?: IContact;
    role: role;

}

const userSchema = new Schema<IUser>({
    ID: { type: String,unique:true },
    email: { type: Schema.Types.String, unique:true, required: true },
    profilePicture:{type:Schema.Types.String,required:false},   
    name:{type:Schema.Types.String,required:true},
    password: {
        hashed: { type: String, required: true },
        salt: { type: String, required: true },
    },
    organization: {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "organization" },
        ID: { type: String, required: true, ref: "organization" },
    },
    contact: {
        phoneNo: { type: String, required: false },
        address: { type: String },
    },
    role: { type: String, enum: ["complainant", "admin"], required: true },


})

userSchema.plugin(autoIncrement, { fieldName: "ID", ModelName: "user", prefix: "UR_" })
userSchema.post<IUser>('save', userService.create_role);
userSchema.post<IUser>("findOneAndDelete",userService.delete_role);
const userModel = model<IUser>("user", userSchema);

export default userModel;

