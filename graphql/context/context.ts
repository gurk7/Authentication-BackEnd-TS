import { Request, Response } from 'express';

export class Context {
    req: Request;
    res: Response;

    //nullable because token might not be valid
    currentUser?: any;

    constructor(req: Request, res: Response, currentUser?: any) {
        this.req = req;
        this.res = res;
        this.currentUser = currentUser;
    }
}