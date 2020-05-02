import 'reflect-metadata'
import { Context } from '../../context';
import { IUserAuthorizer } from '../abstractions/IUserAuthorizer';
import { RegularDecodedToken } from '../entities/regularDecodedToken';
import { IDecodedTokenParser } from '../abstractions/tokens/IDecodedTokenParser';
import { IGraphQLAuthorizationHandler } from './IGraphqlAuthorizationHandler';

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
        let currentUser = this.currentUserParser.parse(currentUserObject);

        if (currentUser) {
            console.log(currentUser);
            return await this.userAuthorizer.authorize(currentUser);
        }
        return false;
    }
}