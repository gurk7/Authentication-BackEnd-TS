import { Service, Inject } from "typedi";
import { RegularLoginInputUser } from "../../authentication/entities/input/regularLoginInputUser";
import { GraphqlLoginHandler } from "./graphqlLoginHandler";
import { AuthenticationResponse } from "../../authentication/entities/response/authenticationResponse";

@Service()
export class LoginService {
    @Inject("LOGIN_HANDLER")
    private readonly loginHandler!: GraphqlLoginHandler<RegularLoginInputUser>;

    public async login(inputUser: RegularLoginInputUser):
        Promise<AuthenticationResponse | undefined> {

        return this.loginHandler.handleLogin(inputUser);
    }
}