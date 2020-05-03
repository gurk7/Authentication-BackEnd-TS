import './node_modules/reflect-metadata'
import { Context } from '../context/context';
import { IUserAuthorizer } from '../../authorization/abstractions/IUserAuthorizer';
import { RegularDecodedToken } from '../../authorization/entities/regularDecodedToken';
import { IDecodedTokenParser } from '../../authorization/abstractions/IDecodedTokenParser';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { HttpResponseStatusProvider } from '../../common/implementations/httpResponseStatusProvider';
import { HttpResponseStatusesConsts } from '../../consts/httpResponseStatusesConsts';
import { IGraphQLAuthorizationHandler } from './IGraphQLAuthorizationHandler';

export class RegularDecodedTokenGraphQLAuthorizationHandler implements IGraphQLAuthorizationHandler {
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
                HttpResponseStatusProvider.add(context.res,
                    HttpResponseStatusesConsts.forbidden);

                throw new ForbiddenError("user in not authorized for that functionallity");
            }
            return true;
        }
        catch (error) {
            if (!(error instanceof ForbiddenError)) {
                HttpResponseStatusProvider.add(context.res,
                    HttpResponseStatusesConsts.unAuthorized);
                throw new AuthenticationError("user is not authenticated");
            }
            throw (error);
        }
    }
}