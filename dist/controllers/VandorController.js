"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFoods = exports.AddFood = exports.UpdateVendorCoverImage = exports.UpdateVAndorService = exports.UpdateVandorProfile = exports.GetVAndorProfile = exports.VandorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const models_1 = require("../models");
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVandor = yield (0, AdminController_1.findVandor)("", email);
    if (existingVandor !== null) {
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVandor.password, existingVandor.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodTypes: existingVandor.foodType,
                name: existingVandor.name,
            });
            return res.json(signature);
        }
        else {
            return res.json({ "message": "Password is not valid" });
        }
    }
    return res.json({ "message": "Login credentials are incorrect" });
});
exports.VandorLogin = VandorLogin;
const GetVAndorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.findVandor)(user._id);
        return res.json(existingVandor);
    }
    return res.json({ "message": "Vandor information Not found" });
});
exports.GetVAndorProfile = GetVAndorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { foodTypes, name, phone, address } = req.body;
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.findVandor)(user._id);
        if (existingVandor !== null) {
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.foodType = foodTypes;
            const savedResult = yield existingVandor.save();
            return res.json(savedResult);
        }
        return res.json(existingVandor);
    }
    return res.json({ "message": "Vandor information Not found" });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const UpdateVAndorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.findVandor)(user._id);
        if (existingVandor !== null) {
            existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
            const savedResult = yield existingVandor.save();
            return res.json(savedResult);
        }
        return res.json(existingVandor);
    }
    return res.json({ "message": "Vandor information Not found" });
});
exports.UpdateVAndorService = UpdateVAndorService;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, AdminController_1.findVandor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.coverImages.push(...images);
            const saveResult = yield vendor.save();
            return res.json(saveResult);
        }
    }
    return res.json({ 'message': 'Unable to Update vendor profile ' });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { name, description, category, foodType, readyTime, price } = req.body;
    if (user) {
        const vendor = yield (0, AdminController_1.findVandor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const food = yield models_1.Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                price: price,
                rating: 0,
                readyTime: readyTime,
                foodType: foodType,
                images: images
            });
            vendor.foods.push(food);
            const result = yield vendor.save();
            return res.json(result);
        }
    }
    return res.json({ 'message': 'Unable to Update vendor profile ' });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vandorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ "message": "Foods information Not found" });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VandorController.js.map