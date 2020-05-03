import { Resolver, Mutation, Arg, Query, Authorized, Ctx } from "type-graphql";
import { Service } from 'typedi'
import { UserInformation } from "../../authentication/entities/userInformation";
import { GraphQLUserInformationService } from "../userInformation/GraphQLUserInformationService";
import { Context } from "../context/context";

@Service()
@Resolver()
export class UserInformationResolver {
    constructor(
        //constructor injection of a service
        private graphQLUserInformationService: GraphQLUserInformationService
    ) { }

    @Query(returns => UserInformation)
    @Authorized()
    async user(@Ctx() context: Context) {
        return await this.graphQLUserInformationService.findUserInformation(context.currentUser);
    }
}