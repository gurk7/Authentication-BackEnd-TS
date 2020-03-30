import { IUserAuthenticator } from './IUserAuthenticator';

//when retrieving User from a DB we will must use Promise.
//(using async await also returns a Promise under the surface)

export interface ISyncUserAuthenticator extends IUserAuthenticator<boolean> {}
