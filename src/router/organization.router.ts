import express, { Router } from "express";
import { create_Collection, get_All_Organization, insert_Organization } from "../controller/organization.controller";


const organizationRouter: Router = express.Router();

organizationRouter.use(express.json())

//get request
organizationRouter.get('/getAllOrganization', get_All_Organization);
//post request
organizationRouter.post('/addOrganization', insert_Organization);

//post request
organizationRouter.post('/createCollection', create_Collection);


export default organizationRouter;