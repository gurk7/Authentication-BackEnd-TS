export class RoutesConfiguration {
  loginFromMongoDBRoute: string;
  loginFromActiveDirectoryRoute: string;
  loginFromCacheRoute: string;
  missionRoute: string;
  defaultRoute: string;

  constructor(
    loginFromMongoDBRoute: string,
    loginFromActiveDirectoryRoute: string,
    loginFromCacheRoute: string,
    missionRoute: string,
    defaultRoute: string
  ) {
    this.loginFromMongoDBRoute = loginFromMongoDBRoute;
    this.loginFromActiveDirectoryRoute = loginFromActiveDirectoryRoute;
    this.loginFromCacheRoute = loginFromCacheRoute;
    this.missionRoute = missionRoute;
    this.defaultRoute = defaultRoute;
  }
}
