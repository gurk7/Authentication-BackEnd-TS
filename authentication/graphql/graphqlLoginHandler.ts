import { IInputUserAuthenticator } from "../abstractions/IInputUserAuthenticator";
import { ITokenCreator } from "../abstractions/ITokenCreator";
import { IAuthenticationResponseCreator } from "../abstractions/IAuthenticationResponseCreator";
import { AuthenticationResponse } from "../entities/response/authenticationResponse";

export class GraphqlLoginHandler<TInputUser>{

    private inputUserAuthenticator: IInputUserAuthenticator<TInputUser>;
    private tokenCreator: ITokenCreator<TInputUser>;
    private authenticationResponseCreator: IAuthenticationResponseCreator;

    constructor(
        inputUserAuthenticator: IInputUserAuthenticator<TInputUser>,
        tokenCreator: ITokenCreator<TInputUser>,
        authenticationResponseCreator: IAuthenticationResponseCreator,
    ) {
        this.inputUserAuthenticator = inputUserAuthenticator;
        this.tokenCreator = tokenCreator;
        this.authenticationResponseCreator = authenticationResponseCreator;
    }

    public async handleLogin(inputUser: TInputUser):
        Promise<AuthenticationResponse | undefined> {

        let isUserAuthenticated = await this.inputUserAuthenticator.authenticate(
            inputUser
        );

        if (isUserAuthenticated) {
            let token = this.tokenCreator.create(inputUser);
            return new AuthenticationResponse(token);
        }
    }
}
