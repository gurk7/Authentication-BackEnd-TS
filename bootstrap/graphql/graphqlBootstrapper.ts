import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { Container } from 'typedi'
import { LoginResolver } from "../../authentication/graphql/loginResolver";
import { GraphqlLoginBootstrapper } from "./graphqlLoginBootstrapper";
import { GraphqlAuthorizationBootstrapper } from "./graphqlAuthorizationBootstrapper";
import { createContext, Context } from "../../context";
import { customAuthChecker } from "../../authorization/graphql/authorizationChecker";

const main = async () => {

    await GraphqlLoginBootstrapper.bootstrap();
    await GraphqlAuthorizationBootstrapper.bootstrap();

    const schema = await buildSchema({
        resolvers: [LoginResolver],
        container: Container,
        emitSchemaFile: true,
        validate: false,
        authChecker: customAuthChecker,
    });


    const server = new ApolloServer({
        schema,
        context: ({ req, res }): Context => {
            return createContext(req, res)
        }
    });

    const app = express();

    server.applyMiddleware({ app, cors: false });

    app.listen({ port: 4000 }, () =>
        console.log('Server ready and listening at ==> http://localhost:4000/graphql'))

};

main().catch((error) => {
    console.log(error, 'error');
})