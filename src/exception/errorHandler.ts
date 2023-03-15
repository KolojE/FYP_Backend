import { Request, Response } from "express";


export enum statusCode {
    badRequest = 400,
    notfound = 404,
    conflict = 409

}
export type clientError = {
    data: string,
    message: string,
    status: number
} & Error

export function clientErrorHandler(err: clientError, req: Request, res: Response, next: Function) {
    res.status(err.status ? err.status : 500).json({
        data: err.data,
        message: err.message
    }).send();
}

export function errorHandler(err: Error, req: Request, res: Response, next: Function) {
    console.error(err);
    res.status(500).json({
        message: "Server error!",
        err: err
    }).send()
}