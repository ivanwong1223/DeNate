import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Mongoose DB is connected");
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/DeNate`);
};

export default connectDB;
