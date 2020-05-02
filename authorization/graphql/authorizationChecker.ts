import 'reflect-metadata'
import { AuthChecker } from 'type-graphql'
import { Context } from '../../context';
import { IUserAuthorizer } from '../abstractions/IUserAuthorizer';
import { RegularDecodedToken } from '../entities/regularDecodedToken';
import { IObjectToRegularDecodedTokenConverter } from '../abstractions/tokens/IObjectToRegularDecodedTokenConverter';

export class AuthorizationChecker {
    private static currentUserParser: IObjectToRegularDecodedTokenConverter;
    private static userAuthorizer: IUserAuthorizer<RegularDecodedToken>;

    constructor(currentUserParser: IObjectToRegularDecodedTokenConverter,
        userAuthorizer: IUserAuthorizer<RegularDecodedToken>) {
        AuthorizationChecker.currentUserParser = currentUserParser;
        AuthorizationChecker.userAuthorizer = userAuthorizer;
    }

    static async authorize(context: Context): Promise<boolean> {
        let currentUserObject = context?.currentUser;
        let currentUser = this.currentUserParser.convert(currentUserObject);

        if (currentUser) {
            console.log(currentUser);
            return await this.userAuthorizer.authorize(currentUser);
        }
        return false;
    }
}

//For each @Authorize(..) TypeGraphQL uses this function.
export const customAuthChecker: AuthChecker<Context> = async (
    { root, args, context, info },
    roles,
) => {
    return await AuthorizationChecker.authorize(context);
};