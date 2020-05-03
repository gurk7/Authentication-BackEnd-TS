import { UserInformation } from "../../../authentication/entities/userInformation";
import { Request } from "express";

export interface IUserInformationGetter {
    getUserInformation(req: Request): Promise<UserInformation>
}