import { Request, Response } from "express";


export function authenticationMiddleware(req: Request, res: Response, next: Function) {
    const token = req.headers["authorization"];


}