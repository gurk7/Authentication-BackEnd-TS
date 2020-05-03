import 'reflect-metadata'
import { AuthChecker } from 'type-graphql'
import { Context } from '../context/context';
import { IGraphQLAuthorizationHandler } from './IGraphQLAuthorizationHandler';

export class GraphQLAuthorizationChecker {
    private static graphqlAuthorizationHandler: IGraphQLAuthorizationHandler;

    constructor(graphqlAuthorizationHandler: IGraphQLAuthorizationHandler) {
        GraphQLAuthorizationChecker.graphqlAuthorizationHandler = graphqlAuthorizationHandler;
    }

    static async authorize(context: Context): Promise<boolean> {
        return this.graphqlAuthorizationHandler.authorize(context);
    }
}

//For each @Authorize(..) TypeGraphQL uses this function.
export const customAuthChecker: AuthChecker<Context> = async (
    { root, args, context, info },
    roles,
) => {
    return await GraphQLAuthorizationChecker.authorize(context);
};