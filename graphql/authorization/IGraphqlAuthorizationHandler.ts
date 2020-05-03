import { Context } from "../context/context";

export interface IGraphQLAuthorizationHandler {
    authorize(context: Context): Promise<boolean>
}