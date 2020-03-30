export interface IUserInformationGetter<T>{
    getUserInformation(req: any, res: any): Promise<T> | undefined
}