import express , { Request , Response , NextFunction } from 'express';
import { AddFood, GetFoods, GetVAndorProfile, UpdateVendorCoverImage, UpdateVAndorService, UpdateVandorProfile, VandorLogin } from '../controllers';
import { Authenticate } from '../middlewares';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('images'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + '_' + file.originalname;
        cb(null, fileName);
    }
});

const images = multer({ storage: imageStorage}).array('images', 10);

router.post('/login', VandorLogin)

router.use(Authenticate)
router.get("/profile" , GetVAndorProfile)
router.patch("/profile", UpdateVandorProfile)
router.patch("/coverimage",images ,UpdateVendorCoverImage)
router.patch("/service", UpdateVAndorService)


router.post("/food",images,AddFood)
router.get("/foods",GetFoods)

router.get('/',(req:Request , res: Response, next:NextFunction)=>{
    return res.json({message : "Hllo from vandor "})
})


export { router as VandorRoute}
