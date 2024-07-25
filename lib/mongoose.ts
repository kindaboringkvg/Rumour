import mongoose from 'mongoose';

let isConncected = false; //if mongoose is connected

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');
    if(isConncected) return console.log('Already connected to MongoDB');

    try {
        await mongoose.connect(process.env.MONGODB_URL);

        isConncected = true;

        console.log('connected to MongoDB');
    } 
    catch(error){
        console.log(error);
    }
}