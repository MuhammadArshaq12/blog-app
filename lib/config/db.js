import mongoose from "mongoose";

export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://arshaqwajid:arshaq1234@cluster0.ambeb.mongodb.net/blog-app');
    console.log("DB Connected");
}