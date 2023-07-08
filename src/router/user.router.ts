import { Router } from "express";
import { getAllForms, getForm,   getProfilePicture,    getReportElement,    getReportPhotoUri,    getUserInfoController, updateProfile, uploadProfilePicture } from "../controller/user.controller";
import { authenticationMiddleware } from "../middleware/authentication.middleware";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";
import { uploadPictureMulter } from "../middleware/multerMiddleware";


const userRouter = Router()

userRouter.use(authenticationMiddleware)

userRouter.get("/getUserInfo",getUserInfoController);
userRouter.get('/getForms',getAllForms);
userRouter.get('/getForm',getForm);
userRouter.get('/getProfilePicture',getProfilePicture);
userRouter.post('/getReportPhotos',getReportPhotoUri);


userRouter.post('/updateProfile',updateProfile)
userRouter.post('/uploadProfilePicture',uploadPictureMulter.single("profilePicture"),uploadProfilePicture)
userRouter.get("/getReportElement", getReportElement);

userRouter.use(clientErrorHandler);
userRouter.use(errorHandler);
export default userRouter;