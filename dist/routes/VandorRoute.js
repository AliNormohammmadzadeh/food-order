"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
exports.VandorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join('images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + '_' + file.originalname;
        cb(null, fileName);
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.post('/login', controllers_1.VandorLogin);
router.use(middlewares_1.Authenticate);
router.get("/profile", controllers_1.GetVAndorProfile);
router.patch("/profile", controllers_1.UpdateVandorProfile);
router.patch("/coverimage", images, controllers_1.UpdateVendorCoverImage);
router.patch("/service", controllers_1.UpdateVAndorService);
router.post("/food", images, controllers_1.AddFood);
router.get("/foods", controllers_1.GetFoods);
router.get('/', (req, res, next) => {
    return res.json({ message: "Hllo from vandor " });
});
//# sourceMappingURL=VandorRoute.js.map