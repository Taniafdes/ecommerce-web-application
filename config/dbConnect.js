import mongoose from "mongoose";

const dbConnect = async () => {
    try {
         mongoose.set('strictQuery', false)
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Database connected ${connect.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1)
    }
}

export default dbConnect

// taniafernandes787
// 5CoOJT2MiLAqNQQ4