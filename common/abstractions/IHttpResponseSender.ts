import express = require('express');

export interface IHttpResponseSender{
    SendResponse<T>(res: express.Response, responseObject: T): void
}