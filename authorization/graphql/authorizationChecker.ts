import 'reflect-metadata'
import { AuthChecker } from 'type-graphql'
import { Context } from '../../context';
import { IUserAuthorizer } from '../abstractions/IUserAuthorizer';
import { RegularDecodedToken } from '../entities/regularDecodedToken';

export class AuthorizationChecker {
    private static userAuthorizer: IUserAuthorizer<RegularDecodedToken>;

    constructor(userAuthorizer: IUserAuthorizer<RegularDecodedToken>) {
        AuthorizationChecker.userAuthorizer = userAuthorizer;
    }

    static async authorize(context: Context): Promise<boolean> {
        let currentUser = context?.currentUser;
        let parsed = new RegularDecodedToken(currentUser?.username, currentUser?.iat, currentUser?.exp);
        if (parsed) {
            console.log(parsed);
            return await this.userAuthorizer.authorize(parsed);
        }
        return false;
    }
}

//For each @Authorize(..) TypeGraphQL uses this function
export const customAuthChecker: AuthChecker<Context> = async (
    { root, args, context, info },
    roles,
) => {
    return await AuthorizationChecker.authorize(context);
};