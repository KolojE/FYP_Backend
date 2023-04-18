import { Request, Response } from "express";


export enum statusCode {
    badRequest = 400,
    notfound = 404,
    conflict = 409,
    unauthorize = 401

}

interface IClientError {

    data?: any;
    status: statusCode;
    message: string;

}

export class clientError extends Error implements IClientError {

    public data: any;
    public status: statusCode;

    constructor({ message, status, data }: IClientError) {
        super(message)
        this.data = data;
        this.status = status;
    }
}

export function clientErrorHandler(err: clientError, req: Request, res: Response, next: Function) {
    if (!(err instanceof clientError)) {
        next(err)
        return
    }

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