import { Resolver, Mutation, Arg, Query, Authorized, Ctx } from "type-graphql";
import { Service } from "typedi";
import { LoginService } from "../login/loginService";
import { RegularLoginInputUser } from "../../authentication/entities/input/regularLoginInputUser";
import { AuthenticationResponse } from "../../authentication/entities/response/authenticationResponse";
import { UserInformation } from "../../authentication/entities/userInformation";
import { Context } from "../context/context";
import { HttpResponseStatusProvider } from "../../common/implementations/httpResponseStatusProvider";
import { HttpResponseStatusesConsts } from "../../consts/httpResponseStatusesConsts";

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
        @Arg("user") logInInputUser: RegularLoginInputUser,
        @Ctx() context: Context): Promise<AuthenticationResponse | undefined> {
        try {
            return await this.loginService.login(logInInputUser);
        }
        catch (error) {
            HttpResponseStatusProvider.add(context.res,
                HttpResponseStatusesConsts.unAuthorized);
            throw (error);
        }
    }
}