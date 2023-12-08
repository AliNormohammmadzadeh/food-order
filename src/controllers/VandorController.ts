import { Request , Response , NextFunction } from "express";
import { VandorLoginInputs } from "../dto";
import { findVandor } from "./AdminController";
import { GeneratePassword, GenerateSignature, ValidatePassword } from "../utility";
import { EditVandorInput } from '../dto/Vandor.dto';
import { CreateFoodInputs } from '../dto/Food.dto';
import { Food } from "../models";

export const VandorLogin = async(req:Request , res: Response , next: NextFunction) => {
    const { email , password} = <VandorLoginInputs>req.body;

    const existingVandor = await findVandor("", email)

    if(existingVandor !== null){
        const validation = await ValidatePassword(password, existingVandor.password , existingVandor.salt)

        if(validation){
            const signature = GenerateSignature({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodTypes: existingVandor.foodType,
                name: existingVandor.name,
            })

            return res.json(signature)
        }else{
            return res.json({"message" : "Password is not valid"})
        }
    }

    return res.json({"message" : "Login credentials are incorrect"})
}

export const GetVAndorProfile = async(req:Request, res: Response , next: NextFunction) => {
    const user = req.user;

    if(user){
        const existingVandor = await findVandor(user._id)

        return res.json(existingVandor)
    }

    return res.json({"message" : "Vandor information Not found"})
}

export const UpdateVandorProfile = async(req:Request, res: Response , next: NextFunction) => {

    const { foodTypes , name , phone , address} = <EditVandorInput>req.body
    const user = req.user;

    if(user){
        const existingVandor = await findVandor(user._id)

        if(existingVandor !== null){
            existingVandor.name = name
            existingVandor.address = address
            existingVandor.phone = phone
            existingVandor.foodType = foodTypes

            const savedResult = await existingVandor.save()
            return res.json(savedResult)
        }

        return res.json(existingVandor)
    }

    return res.json({"message" : "Vandor information Not found"})
}

export const UpdateVAndorService = async(req:Request, res: Response , next: NextFunction) => {


    const user = req.user;

    if(user){
        const existingVandor = await findVandor(user._id)

        if(existingVandor !== null){
            existingVandor.serviceAvailable = !existingVandor.serviceAvailable
            const savedResult = await existingVandor.save()
            return res.json(savedResult)
        }

        return res.json(existingVandor)
    }

    return res.json({"message" : "Vandor information Not found"})
}


export const UpdateVendorCoverImage = async (req: Request,res: Response, next: NextFunction) => {

    const user = req.user;

     if(user){

       const vendor = await findVandor(user._id);

       if(vendor !== null){

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            vendor.coverImages.push(...images);

            const saveResult = await vendor.save();
            
            return res.json(saveResult);
       }

    }
    return res.json({'message': 'Unable to Update vendor profile '})

}

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;
     
    if(user){

       const vendor = await findVandor(user._id);

       if(vendor !== null){

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);
            
            const food = await Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                price: price,
                rating: 0,
                readyTime: readyTime,
                foodType: foodType,
                images: images
            })
            
            vendor.foods.push(food);
            const result = await vendor.save();
            return res.json(result);
       }

    }
    return res.json({'message': 'Unable to Update vendor profile '})
}


export const GetFoods = async(req:Request, res: Response , next: NextFunction) => {
    const user = req.user;

    if(user){
        const foods = await Food.find({ vandorId: user._id})

        if(foods !== null){
            return res.json(foods)
        }
    }

    return res.json({"message" : "Foods information Not found"})
}