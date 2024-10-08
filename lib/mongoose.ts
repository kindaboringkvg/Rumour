import mongoose, { mongo } from 'mongoose';

let isConnected = false; //if mongoose is connected

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);
    mongoose.set('strictPopulate', false);

    if(!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');
    if(isConnected) return console.log('Already connected to MongoDB');

    try {
        await mongoose.connect(process.env.MONGODB_URL);

        isConnected = true;

        console.log('connected to MongoDB');
    } 
    catch(error){
        console.log(error);
    }
}