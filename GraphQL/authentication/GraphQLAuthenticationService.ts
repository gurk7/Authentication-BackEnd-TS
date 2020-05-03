import { Service, Inject } from "typedi";
import { AuthenticationResponse } from "../../authentication/entities/response/authenticationResponse";
import { IAuthenticationHandler } from "../../authentication/abstractions/IAuthenticationHandler";

@Service()
export class GraphQLAuthenticationService<TInputUser> {
    @Inject("AUTHENTICATION_HANDLER")
    private readonly authenticationHandler!: IAuthenticationHandler<TInputUser>;

    public async authenticate(inputUser: TInputUser):
        Promise<AuthenticationResponse> {

        return this.authenticationHandler.handleAuthentication(inputUser);
    }
}