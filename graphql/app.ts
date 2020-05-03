import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { Container } from 'typedi'
import { Context } from "./context/context";
import { createContext } from "./context/contextCreator";
import { LoginResolver } from "./resolvers/loginResolver";
import { GraphQLAuthenticationBootstrapper } from "./bootstrap/GraphQLAuthenticationBootstrapper";
import { GraphQLAuthorizationBootstrapper } from "./bootstrap/GraphQLAuthorizationBootstrapper";
import { customAuthChecker } from "./authorization/GraphQLAuthorizationChecker";

const main = async () => {

    await GraphQLAuthenticationBootstrapper.bootstrap();
    await GraphQLAuthorizationBootstrapper.bootstrap();

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