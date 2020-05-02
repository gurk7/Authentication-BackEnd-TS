import { Resolver, Mutation, Arg, Query, Authorized } from "type-graphql";
import { Service } from "typedi";
import { LoginService } from "./loginService";
import { RegularLoginInputUser } from "../entities/input/regularLoginInputUser";
import { AuthenticationResponse } from "../entities/response/authenticationResponse";
import { UserInformation } from "../entities/userInformation";

@Service()
@Resolver()
export class LoginResolver {
    constructor(
        //constructor injection of a service
        private readonly loginService: LoginService
    ) { }

    @Query(returns => UserInformation)
    @Authorized()
    async user(@Arg("username") username: string) {
        return new UserInformation(username);
    }

    @Mutation(returns => AuthenticationResponse, { nullable: true })
    async login(
        @Arg("user") logInInputUser: RegularLoginInputUser): Promise<AuthenticationResponse | undefined> {
        return await this.loginService.login(logInInputUser);
    }
}