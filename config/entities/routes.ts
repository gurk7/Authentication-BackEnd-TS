export class RoutesConfiguration {
  loginRoute: string;
  missionRoute: string;
  defaultRoute: string;

  constructor(loginRoute: string, missionRoute: string, defaultRoute: string) {
    this.loginRoute = loginRoute;
    this.missionRoute = missionRoute;
    this.defaultRoute = defaultRoute;
  }
}
