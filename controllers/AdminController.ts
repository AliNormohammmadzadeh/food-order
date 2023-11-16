import { Request , Response , NextFunction } from 'express';
import { CreateVandorInput } from '../dto';
import { Vandor } from '../models';
import { GeneratePassword, GenerateSlat } from '../utility';

export const CreateVandor = async (req:Request , res :Response , next: NextFunction ) => {
    const {name , address , pincode , foodType , email , password, ownerName , phone} = <CreateVandorInput>req.body

    const existingVandor = await Vandor.findOne({email: email})

    if(existingVandor !== null) {
        return res.json({"message" : "A vandor is already exist with this email or ID"})
    }

    const salt = await GenerateSlat()
    const userPassword = await GeneratePassword(password , salt)

    const createVandor = await Vandor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages:[]
    })
    

    return res.json(createVandor)
}

export const GetVandors = async (req:Request , res :Response , next: NextFunction ) => {
    
}

export const GetVandorByID = async (req:Request , res :Response , next: NextFunction ) => {
    
}