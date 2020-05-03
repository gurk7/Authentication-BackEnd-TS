import { ObjectType, Field } from "type-graphql";

/*
  Decorators are created for TypeGraphQL reflection, allowance for GraphQL's schema
*/

@ObjectType()
export class AuthenticationResponse {
  @Field({ nullable: true })
  token?: string;

  constructor(token?: string) {
    this.token = token;
  }
}