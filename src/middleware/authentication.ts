import { Request, Response, RequestHandler } from "express";


export const authentication: RequestHandler = function (req: Request, res: Response, next: Function) {
    next();
}