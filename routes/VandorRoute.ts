import express , { Request , Response , NextFunction } from 'express';
import { GetVAndorProfile, UpdateVAndorService, UpdateVandorProfile, VandorLogin } from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/login', VandorLogin)

router.use(Authenticate)
router.get("/profile" , GetVAndorProfile)
router.patch("/profile", UpdateVandorProfile)
router.patch("/service", UpdateVAndorService)

router.get('/',(req:Request , res: Response, next:NextFunction)=>{
    return res.json({message : "Hllo from vandor "})
})


export { router as VandorRoute}
