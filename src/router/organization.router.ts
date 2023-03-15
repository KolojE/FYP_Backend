import express, { Router } from "express";
import { create_Collection, register_Organization } from "../controller/organization.controller";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";


const organizationRouter: Router = express.Router();

organizationRouter.use(express.json())




organizationRouter.post('/addOrganization', register_Organization);
organizationRouter.post('/createCollection', create_Collection);


//error handler middleware
organizationRouter.use(clientErrorHandler);
organizationRouter.use(errorHandler);
export default organizationRouter;