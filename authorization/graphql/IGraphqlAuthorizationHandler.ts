import { Context } from "../../context";

export interface IGraphQLAuthorizationHandler {
    authorize(context: Context): Promise<boolean>
}