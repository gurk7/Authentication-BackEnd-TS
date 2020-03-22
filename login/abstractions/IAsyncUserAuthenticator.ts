import { IUserAuthenticator } from "./IUserAuthenticator";
import { User } from "../../entities/user";

//when retrieving User from a DB we will must use Promise.
//(using async await also returns a Promise under the surface)

export interface IAsyncUserAuthenticator
  extends IUserAuthenticator<Promise<boolean>> {}
