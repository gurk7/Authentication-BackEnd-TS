import { ObjectType, Field } from "type-graphql";

/*
  Decorators are created for TypeGraphQL reflection, allowance for GraphQL's schema
*/

@ObjectType()
export class UserInformation {

  @Field()
  userName!: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  //Capital S in String for typeGraphQL decorator that creates a schema from it
  @Field(type => [String], { nullable: true })
  groups?: string[];

  constructor(userName: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    groups?: string[]) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.groups = groups;
  }
}