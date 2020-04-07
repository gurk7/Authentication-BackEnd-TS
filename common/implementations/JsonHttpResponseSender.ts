import { IHttpResponseSender } from "../abstractions/IHttpResponseSender";
import express = require('express');

export class JsonHttpResponseSender implements IHttpResponseSender{

    SendResponse<T>(res: express.Response, response: T, status: number){
        res.status(status).json(response);
    }
}