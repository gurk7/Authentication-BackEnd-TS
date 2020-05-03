import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";
import { ITokenCreator } from "../../authentication/abstractions/ITokenCreator";
import { AuthenticationResponse } from "../../authentication/entities/response/authenticationResponse";
import { AuthenticationError } from 'apollo-server-express';

export class GraphQLLoginHandler<TInputUser>{

    private inputUserAuthenticator: IInputUserAuthenticator<TInputUser>;
    private tokenCreator: ITokenCreator<TInputUser>;

    constructor(
        inputUserAuthenticator: IInputUserAuthenticator<TInputUser>,
        tokenCreator: ITokenCreator<TInputUser>,
    ) {
        this.inputUserAuthenticator = inputUserAuthenticator;
        this.tokenCreator = tokenCreator;
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
        else {
            throw new AuthenticationError("user is not authenticated");
        }
    }
}
