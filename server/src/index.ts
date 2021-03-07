import "reflect-metadata"; // needed for both TypeORM and TypeGraphQL
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  // db connection
  const connection = await createConnection({
    type: "postgres",
    url: "postgresql://postgres:postgres@localhost:5432/lebank",
    logging: true,
    synchronize: true, // false when in prod
    migrations: ["dist/migrations/*.js"],
    entities: [User],
  });
  // await connection.runMigrations();

  // app
  const app = express();

  // Apollo
  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [HelloResolver], validate: false }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
