import { AuthenticationResponse } from "../entities/response/authenticationResponse";

export interface IAuthenticationHandler<TInputUser> {
    handleAuthentication(inputUser: TInputUser):
        Promise<AuthenticationResponse>
}