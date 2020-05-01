import { Resolver, Mutation, Arg, Query, Authorized, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { LoginService } from "./loginService";
import { RegularLoginInputUser } from "../entities/input/regularLoginInputUser";
import { AuthenticationResponse } from "../entities/response/authenticationResponse";
import { GraphqlTokenBasedAuthorizationMiddleware } from "../../authorization/graphql/graphqlTokenBasedAuthorizationHandler";

@Service()
@Resolver()
export class LoginResolver {
    constructor(
        //constructor injection of a service
        private readonly loginService: LoginService
    ) { }

    @Query(returns => Boolean)
    @UseMiddleware(GraphqlTokenBasedAuthorizationMiddleware)
    async user(@Arg("username") username: string) {
        return true;
    }

    @Mutation(returns => AuthenticationResponse, { nullable: true })
    async login(
        @Arg("user") logInInputUser: RegularLoginInputUser): Promise<AuthenticationResponse | undefined> {
        return await this.loginService.login(logInInputUser);
    }
}