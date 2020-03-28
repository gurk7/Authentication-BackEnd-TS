export class User {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  equals(otherUser: User): boolean {
    if (
      this.username === otherUser.username &&
      this.password === otherUser.password
    ) {
      return true;
    }
    return false;
  }
}
