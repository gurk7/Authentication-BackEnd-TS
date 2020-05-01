import { MiddlewareInterface, ResolverData, NextFn } from 'type-graphql';
import { Service, Inject } from 'typedi';
import { IAuthorizationHandler } from '../abstractions/IAuthorizationHandler';

@Service()
export class GraphqlTokenBasedAuthorizationMiddleware<TContext> implements MiddlewareInterface<TContext> {
    @Inject("AUTHORIZATION_HANDLER")
    private readonly authorizationHandler!: IAuthorizationHandler;

    async use({ context }: ResolverData<TContext>, next: NextFn) {
        let authorized = await this.authorizationHandler.handleAuthorization(context.req, context.res);
        if (authorized) {
            next();
        }
    }
}