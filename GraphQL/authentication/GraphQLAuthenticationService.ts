import { Service, Inject } from "typedi";
import { RegularLoginInputUser } from "../../authentication/entities/input/regularLoginInputUser";
import { GraphQLAuthenticationHandler } from "./GraphQLAuthenticationHandler";
import { AuthenticationResponse } from "../../authentication/entities/response/authenticationResponse";

@Service()
export class GraphQLAuthenticationService {
    @Inject("AUTHENTICATION_HANDLER")
    private readonly authenticationHandler!: GraphQLAuthenticationHandler<RegularLoginInputUser>;

    public async authenticate(inputUser: RegularLoginInputUser):
        Promise<AuthenticationResponse> {

        return this.authenticationHandler.handleAuthentication(inputUser);
    }
}