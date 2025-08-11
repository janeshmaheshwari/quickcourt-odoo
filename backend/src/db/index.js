import mongoose from "mongoose";


const connectDB = async () => {
  mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then(() => {
      console.log(`DB Connected! DB Host`);
    })
    .catch((error) => {
      console.log("ERROR ", error);
      process.exit(1);
    });
};


export default connectDB;