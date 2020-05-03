import { Response } from "express";

export class HttpResponseStatusProvider {
    static add(res: Response, status: number) {
        res.status(status);
    }
}