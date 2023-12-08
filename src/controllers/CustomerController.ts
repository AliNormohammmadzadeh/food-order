import { plainToClass } from 'class-transformer';
import { Request , Response , NextFunction} from 'express';
import { CreateCustomerInputs, EditCusotmerProfileInputs, UserLoginInputs } from '../dto/Customer.dto';
import { validate } from 'class-validator';
import { GenerateOtp, GeneratePassword, GenerateSignature, GenerateSlat, ValidatePassword, onRequestOTP } from '../utility';
import { Customer } from '../models';
import express from 'express';


export const CustomerSignup = async(req:Request, res: Response, next:NextFunction) => {
    const customerInputs = plainToClass(CreateCustomerInputs, req.body);

    const inputErrors = await validate(customerInputs, { validationError: { target: true}})

    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email , phone , password} = customerInputs

    const salt = await GenerateSlat()
    const userPassword = await GeneratePassword(password,salt)

    const {otp , expiry} =  GenerateOtp()

    const existingCustomer = await Customer.findOne({email : email})

    if(existingCustomer !== null){
        return res.status(409).json({ message : "Error the user already provide this Email ID"})
    }

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: "",
        lastName: "",
        address: "",
        verified: false,
        lat: 0,
        lng: 0
    })

    if(result){
        await onRequestOTP(otp, phone)

        const signature = GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })

        return res.status(201).json({ signature: signature, verified: result.verified, email : result.email })
    }
    
    return res.status(400).json({ message : "Error with Signup"})

}

export const CustomerLogin = async(req:Request, res: Response, next:NextFunction) => {
    const loginInputs = plainToClass(UserLoginInputs,req.body)

    const loginError = await validate(loginInputs, {validationError : {target: true}})

    if(loginError.length > 0){
        return res.status(400).json(loginError)
    }

    const { email , password } = loginInputs
    const customer = await Customer.findOne({email : email})

    if(customer){
        const validation = await ValidatePassword(password , customer.password, customer.salt)

        if(validation){
            const signature = GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            })

            return res.status(201).json({ signature: signature, verified: customer.verified, email : customer.email })
        }
    }

    return res.status(404).json({message: "Login error!"})
}


export const CustomerVerify = async(req:Request, res: Response, next:NextFunction) => {
    const { otp } = req.body;
    const customer = req.user

    if(customer){
        const profile = await Customer.findById(customer._id)

        if(profile){
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
                profile.verified = true;
                const updatedCustomerResponse = await profile.save()

                const signature = GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })

                return res.status(201).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email
                })
            }
        }
    }

    return res.status(400).json({ message : "Error with OTP validation"})
}

export const RequestOtp = async(req:Request, res: Response, next:NextFunction) => {
    const customer = req.user

    if(customer){
        const profile = await Customer.findById(customer._id)

        if(profile){
            const { otp , expiry } = GenerateOtp()

            profile.otp = otp;
            profile.otp_expiry =  expiry

            await profile.save()
            await onRequestOTP(otp, profile.phone)

            return res.status(200).json({ message : "OTP sent your registred phone number!"})
        }
    }

    return res.status(400).json({ message : "Error with Request OTP"})
}

export const GetCustomerProfile = async(req:Request, res: Response, next:NextFunction) => {
    const customer = req.user
    console.log(customer)


    if(customer){
        const profile = await Customer.findById(customer._id)
        console.log(profile)
        if(profile){
            return res.status(200).json(profile)
        }
        return res.status(404).json({ message : "Error With profile"})
    }

    return res.status(400).json({ message : "Error with Fetching Profile"})
}

export const EditCustomerProfile = async(req:Request, res: Response, next:NextFunction) => {
    const customer = req.user

    const profileInputs = plainToClass( EditCusotmerProfileInputs, req.body)

    const profileError = await validate(profileInputs, {validationError : {target: true}})

    if(profileError.length > 0){
        return res.status(400).json(profileError)
    }

    const { firstName , lastName , address } = profileInputs

    if(customer){
        const profile = await Customer.findById(customer._id)

        if(profile){
            
            profile.firstName = firstName
            profile.lastName = lastName
            profile.address = address

            const result = await profile.save()

            return res.status(200).json(result)
        }
    }

    return res.status(400).json({ message : "Error with Edit Profile"})
}

export const GetAllCustomer = async(req:Request, res: Response, next:NextFunction) => {
    const allCustomer = await Customer.find()

    return res.json(allCustomer)
}

export const RemoveCustomer = async(req:Request, res: Response, next:NextFunction) => {
    const {email} = req.body
    const result = await Customer.deleteMany({email:email})

    return res.json(result)
}