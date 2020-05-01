import { Service, Inject } from "typedi";
import { RegularLoginInputUser } from "../entities/input/regularLoginInputUser";
import { GraphqlLoginHandler } from "./graphqlLoginHandler";
import { AuthenticationResponse } from "../entities/response/authenticationResponse";

@Service()
export class LoginService {
    @Inject("LOGIN_HANDLER")
    private readonly loginHandler!: GraphqlLoginHandler<RegularLoginInputUser>;

    public async login(inputUser: RegularLoginInputUser):
        Promise<AuthenticationResponse | undefined> {

        return this.loginHandler.handleLogin(inputUser);
    }
}