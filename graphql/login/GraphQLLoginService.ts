import { Service, Inject } from "typedi";
import { RegularLoginInputUser } from "../../authentication/entities/input/regularLoginInputUser";
import { GraphQLLoginHandler } from "./GraphQLLoginHandler";
import { AuthenticationResponse } from "../../authentication/entities/response/authenticationResponse";

@Service()
export class GraphQLLoginService {
    @Inject("LOGIN_HANDLER")
    private readonly loginHandler!: GraphQLLoginHandler<RegularLoginInputUser>;

    public async login(inputUser: RegularLoginInputUser):
        Promise<AuthenticationResponse> {

        return this.loginHandler.handleLogin(inputUser);
    }
}