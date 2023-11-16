import mongoose , { Schema , Document , Model } from "mongoose";

interface VandorDoc extends Document {
    name : string;
    ownerName: string;
    foodType : [string];
    pincode: string;
    address: string;
    phone : string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: string;
    coverImages: [string];
    rating: number;
    // foods: any
}

const VandorSchema = new Schema({
    name : {type: String , require: true},
    ownerName: {type : String , require: true},
    foodType : {type : [String]},
    pincode: {type : String , require: true},
    address: {type: String , require: true},
    phone :{type: String , require: true},
    email:{type: String , require: true},
    password: {type: String , require: true},
    salt: {type: String , require: true},
    serviceAvailable: {type: Boolean},
    coverImages: {type : [String]},
    rating: {type : Number},
    // foods: [{
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'food'
    // }]
},
   {
    toJSON: {
        transform(doc,ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
})

const Vandor = mongoose.model<VandorDoc>("vandor", VandorSchema)

export { Vandor}