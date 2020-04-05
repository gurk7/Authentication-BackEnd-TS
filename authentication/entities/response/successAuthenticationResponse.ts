export class SuccessAuthenticationResponse{
    success: boolean;
    message: string;
    token: string;

    constructor(success: boolean, message: string, token: string)
    {
        this.success = success;
        this.message = message;
        this.token = token;
    }
}