import express = require('express');

export interface IHttpResponseSender{
    //Sends parsed response over http
    SendResponse<T>(res: express.Response, response: T): void
}