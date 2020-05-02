import { ObjectType, Field } from "type-graphql";
import { UserInformation } from "../userInformation";

/*
  Decorators are created for TypeGraphQL reflection, allowance for GraphQL's schema
*/

@ObjectType()
export class AuthenticationResponse {
  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  userInformation?: UserInformation

  constructor(token?: string,
    userInformation?: UserInformation) {
    this.token = token;
    this.userInformation = userInformation;
  }
}