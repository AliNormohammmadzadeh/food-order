import mongoose from "mongoose";


import { MONGO_URI } from '../config';


export default async() => {
    try {
        await mongoose.connect(MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
        })
        console.clear()
        console.log("DB Connected...")
        
    } catch (error) {
        console.log(error)
    }    
}    


