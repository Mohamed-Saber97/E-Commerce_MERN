import mongoose, { Document, Schema } from "mongoose";

//interface
export interface Iuser extends Document{

    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
//schema 
const userSchema = new Schema<Iuser>({

    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});


//model
const userModel = mongoose.model<Iuser>('User', userSchema);

//export

export default userModel;
