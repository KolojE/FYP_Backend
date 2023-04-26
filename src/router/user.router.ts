import { Router } from "express";
import { getAllForms, getForm, getUserInfoController } from "../controller/user.controller";
import { authenticationMiddleware } from "../middleware/authentication.middleware";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";


const userRouter = Router()

userRouter.use(authenticationMiddleware)

userRouter.get("/getUserInfo",getUserInfoController);
userRouter.get('/getForms',getAllForms)
userRouter.get('/getForm',getForm)
userRouter.use(clientErrorHandler);
userRouter.use(errorHandler);
export default userRouter;