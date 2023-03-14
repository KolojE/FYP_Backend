import express, { Router } from "express";
import { create_Collection, get_All_Organizations, register_Organization } from "../controller/organization.controller";


const organizationRouter: Router = express.Router();

organizationRouter.use(express.json())

//get request
organizationRouter.get('/getAllOrganization', get_All_Organizations);
//post request
organizationRouter.post('/addOrganization', register_Organization);

//post request
organizationRouter.post('/createCollection', create_Collection);


export default organizationRouter;