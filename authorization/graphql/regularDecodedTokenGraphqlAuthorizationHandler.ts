import 'reflect-metadata'
import { Context } from '../../context';
import { IUserAuthorizer } from '../abstractions/IUserAuthorizer';
import { RegularDecodedToken } from '../entities/regularDecodedToken';
import { IDecodedTokenParser } from '../abstractions/tokens/IDecodedTokenParser';
import { IGraphQLAuthorizationHandler } from './IGraphqlAuthorizationHandler';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

export class RegularDecodedTokenGraphqlAuthorizationHandler implements IGraphQLAuthorizationHandler {
    private currentUserParser: IDecodedTokenParser;
    private userAuthorizer: IUserAuthorizer<RegularDecodedToken>;

    constructor(currentUserParser: IDecodedTokenParser,
        userAuthorizer: IUserAuthorizer<RegularDecodedToken>) {
        this.currentUserParser = currentUserParser;
        this.userAuthorizer = userAuthorizer;
    }

    async authorize(context: Context): Promise<boolean> {
        let currentUserObject = context?.currentUser;
        try {
            let currentUser = this.currentUserParser.parse(currentUserObject);
            let authorized = await this.userAuthorizer.authorize(currentUser);
            if (!authorized) {
                context.res.status(403);
                throw new ForbiddenError("user in not authorized for that functionallity");
            }
            return true;
        }
        catch (error) {
            if (!(error instanceof ForbiddenError)) {
                context.res.status(401);
                throw new AuthenticationError("user is not authenticated");
            }
            throw (error);
        }
    }
}