import express from 'express';import { CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetAllCustomer, GetCustomerProfile, RemoveCustomer, RequestOtp } from '../controllers';
import { Authenticate } from '../middlewares';
express

const router = express.Router()

router.get('/users',GetAllCustomer)
router.delete("/users",RemoveCustomer)

router.post('/signup',CustomerSignup)
router.post('/login', CustomerLogin)

router.use(Authenticate)
router.patch('/verify', CustomerVerify)
router.get('/otp',RequestOtp)
router.get('/profile',GetCustomerProfile)
router.patch('/profile', EditCustomerProfile)

export { router as CustomerRoute}
