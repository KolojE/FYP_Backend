import { Document, model, Schema, Types } from "mongoose";
import { autoIncrement } from "../plugin/autoincrement";
import { userService } from "../services/user.service";

export enum role {
    admin = "admin",
    complainant = "complainant"
}
interface organization {

    _id: Types.ObjectId;
    ID: string;
}
interface contact {

    phoneNo: String;
    address: String;
}
export interface User extends Document {
    ID: string;
    email: string;
    password: {
        hashed: string;
        salt: string;
    },
    organization: organization;
    contact: contact;
    role: role;

}

const userSchema = new Schema<User>({
    ID: { type: String },
    email: { type: Schema.Types.String, required: true },
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
userSchema.post<User>('save', userService.create_role);
const userModel = model<User>("User", userSchema);

export default userModel;

