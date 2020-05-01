import { InputType, Field } from "type-graphql";

/*
  Decorators are created for TypeGraphQL reflection, allowance for GraphQL's schema
  This type is used For both REST and GraphQL
*/

@InputType()
export class RegularLoginInputUser {
  @Field()
  username: string;

  @Field()
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  equals(otherUser: RegularLoginInputUser): boolean {
    if (
      this.username === otherUser.username &&
      this.password === otherUser.password
    ) {
      return true;
    }
    return false;
  }
}
