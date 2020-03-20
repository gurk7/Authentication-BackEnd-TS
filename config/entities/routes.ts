export class RoutesConfiguration {
  loginFromMongoDBRoute: string;
  loginFromCacheRoute: string;
  missionRoute: string;
  defaultRoute: string;

  constructor(
    loginFromMongoDBRoute: string,
    loginFromCacheRoute: string,
    missionRoute: string,
    defaultRoute: string
  ) {
    this.loginFromMongoDBRoute = loginFromMongoDBRoute;
    this.loginFromCacheRoute = loginFromCacheRoute;
    this.missionRoute = missionRoute;
    this.defaultRoute = defaultRoute;
  }
}
